require('dotenv').config({ path: './.env' });
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Category = require('../src/models/Categories');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');
let token, categoryId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Category.deleteMany({});
  await User.deleteMany({});
  const user = await User.create({ username: 'usertest', email: 'usertest@test.com', password: 'usertestpass', isAdmin: true });
  token = jwt.sign({ id: user._id, isAdmin: true }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await Category.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Category API', () => {
  it('creates a category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'GPU' });
    expect(res.statusCode).toBe(201);
    categoryId = res.body._id;
  });

  it('gets all categories', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('refuses creation without token', async () => {
    const res = await request(app)
      .post('/api/categories')
      .send({ name: 'RAM' });
    expect(res.statusCode).toBe(401);
  });
});