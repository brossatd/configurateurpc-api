require('dotenv').config({ path: './.env' });
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Partner = require('../src/models/Partner');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');
let token, partnerId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Partner.deleteMany({});
  await User.deleteMany({});
  const user = await User.create({ username: 'usertest', email: 'usertest@test.com', password: 'usertestpass', isAdmin: true });
  token = jwt.sign({ id: user._id, isAdmin: true }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await Partner.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Partner API', () => {
  it('creates a partner', async () => {
    const res = await request(app)
      .post('/api/partners')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Amazon', url: 'https://amazon.fr', commission: 5 });
    expect(res.statusCode).toBe(201);
    partnerId = res.body._id;
  });

  it('gets all partners', async () => {
    const res = await request(app).get('/api/partners');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('refuses creation without token', async () => {
    const res = await request(app)
      .post('/api/partners')
      .send({ name: 'LDLC', url: 'https://ldlc.com', commission: 4 });
    expect(res.statusCode).toBe(401);
  });
});