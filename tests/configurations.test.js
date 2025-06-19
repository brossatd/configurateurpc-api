require('dotenv').config({ path: './.env' });
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Configuration = require('../src/models/Configuration');
const Component = require('../src/models/Component');
const Category = require('../src/models/Categories');
const Partner = require('../src/models/Partner');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

let token, userId, categoryId, componentId, partnerId, configId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Configuration.deleteMany({});
  await Component.deleteMany({});
  await Category.deleteMany({});
  await Partner.deleteMany({});
  await User.deleteMany({});

  // Crée user, token, category, partner, component
  const user = await User.create({ username: 'usertest_config', email: 'usertest_config@test.com', password: 'usertestpass', isAdmin: true });
  userId = user._id;
  token = jwt.sign({ id: user._id, isAdmin: false }, process.env.JWT_SECRET);

  const cat = await Category.create({ name: 'RAM', slug: 'ram' });
  categoryId = cat._id;

  const partner = await Partner.create({ name: 'CDiscount', url: 'https://cdiscount.com', commission: 3 });
  partnerId = partner._id;

  const comp = await Component.create({
    category: categoryId,
    brand: 'Corsair',
    title: 'Vengeance',
    description: 'RAM',
    model: 'Vengeance LPX',
    specs: { size: '16GB' },
    prices: [{ partner: partnerId, price: 80 }]
  });
  componentId = comp._id;
});

afterAll(async () => {
  await Configuration.deleteMany({});
  await Component.deleteMany({});
  await Category.deleteMany({});
  await Partner.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Configuration API', () => {
  it('creates a configuration', async () => {
    const res = await request(app)
      .post('/api/configurations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Ma config',
        components: [{ component: componentId, partner: partnerId }]
      });
    expect(res.statusCode).toBe(201);
    configId = res.body._id;
  });

  it('gets user configurations', async () => {
    const res = await request(app)
      .get('/api/configurations')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('gets a configuration by id', async () => {
    const res = await request(app)
      .get(`/api/configurations/${configId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Ma config');
  });

  it('gets total cost', async () => {
    const res = await request(app)
      .get(`/api/configurations/${configId}/total`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBe(80);
  });

  it('deletes a configuration', async () => {
    const res = await request(app)
      .delete(`/api/configurations/${configId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});