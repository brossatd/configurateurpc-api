require('dotenv').config({ path: './.env' });
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Component = require('../src/models/Component');
const Category = require('../src/models/Categories');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

let token, categoryId, componentId, partnerId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Component.deleteMany({});
  await Category.deleteMany({});
  await User.deleteMany({});
  const user = await User.create({ username: 'usertest', email: 'usertest@test.com', password: 'usertestpass', isAdmin: true });
  token = jwt.sign({ id: user._id, isAdmin: true }, process.env.JWT_SECRET);
  const cat = await Category.create({ name: 'RAM', slug: 'ram' });
  categoryId = cat._id;
  // Ajoute un partenaire pour les tests de prix
  const Partner = require('../src/models/Partner');
  await Partner.deleteMany({});
  const partner = await Partner.create({ name: 'TestPartner', url: 'https://test.com', commission: 1 });
  partnerId = partner._id;
});

afterAll(async () => {
  await Component.deleteMany({});
  await Category.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Component API', () => {
  it('creates a component', async () => {
    const res = await request(app)
      .post('/api/components')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: categoryId, brand: 'Intel', title: 'i7', description: 'CPU', model: 'i7-12700K', specs: { cores: 12 } });
    expect(res.statusCode).toBe(201);
    componentId = res.body._id;
  });

  it('gets all components', async () => {
    const res = await request(app).get('/api/components');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('gets a component by id', async () => {
    const res = await request(app).get(`/api/components/${componentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('i7');
  });

  it('updates a component', async () => {
    const res = await request(app)
      .put(`/api/components/${componentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ brand: 'AMD' });
    expect(res.statusCode).toBe(200);
    expect(res.body.brand).toBe('AMD');
  });

  it('deletes a component', async () => {
    const res = await request(app)
      .delete(`/api/components/${componentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('admin peut ajouter un prix pour un partenaire', async () => {
    const res = await request(app)
      .post(`/api/components/${componentId}/prices`)
      .set('Authorization', `Bearer ${token}`)
      .send({ partner: partnerId, price: 99.99 });
    expect(res.statusCode).toBe(200);
    expect(res.body.prices.some(p => p.partner === partnerId.toString())).toBe(true);
  });

  it('admin peut supprimer un prix pour un partenaire', async () => {
    const res = await request(app)
      .delete(`/api/components/${componentId}/prices/${partnerId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});