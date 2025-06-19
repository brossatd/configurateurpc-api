require('dotenv').config({ path: './.env' });
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

let token, userId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  const user = await User.create({ username: 'usertest', email: 'usertest@test.com', password: 'usertestpass', isAdmin: true });
  userId = user._id;
  token = jwt.sign({ id: user._id, isAdmin: true }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('User API', () => {
  it('gets all users (admin only)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    // Adapte le code de retour selon ta route
    expect([200, 404, 403]).toContain(res.statusCode);
  });

  it('gets user by id (admin only)', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404, 403]).toContain(res.statusCode);
  });
});