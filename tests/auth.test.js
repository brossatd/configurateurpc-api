require('dotenv').config({ path: './.env' });
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth API', () => {
  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'test@test.com', password: 'testpass' });
    expect(res.statusCode).toBe(201);
  });

  it('refuses duplicate registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'test@test.com', password: 'testpass' });
    expect(res.statusCode).toBe(400);
  });

  it('logs in a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'testpass' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('refuses invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrongpass' });
    expect(res.statusCode).toBe(400);
  });

  it('registers an admin user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'adminuser', email: 'admin@test.com', password: 'adminpass', isAdmin: true });
    expect(res.statusCode).toBe(201);
  });

  it('logs in an admin user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'adminuser', password: 'adminpass' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});