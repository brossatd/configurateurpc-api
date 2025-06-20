const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');
const Partner = require('./src/models/Partner');
const Component = require('./src/models/Component');
const Categories = require('./src/models/Categories');
const Configuration = require('./src/models/Configuration');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connecté');
  } catch (err) {
    console.error('❌ Connexion échouée', err);
    process.exit(1);
  }
};

const populate = async () => {
  await connectDB();

  // Reset DB
  await User.deleteMany();
  await Partner.deleteMany();
  await Component.deleteMany();
  await Categories.deleteMany();
  await Configuration.deleteMany();

  // Utilisateurs
  const admin = await User.create({
    username: 'admin',
    email: 'admin@test.com',
    password: await bcrypt.hash('adminpass', 10),
    isAdmin: true
  });

  const users = await User.insertMany([
    {
      username: 'usertest',
      email: 'user@test.com',
      password: await bcrypt.hash('userpass', 10),
      isAdmin: false
    },
    {
      username: 'alice',
      email: 'alice@example.com',
      password: await bcrypt.hash('alice123', 10),
      isAdmin: false
    },
    {
      username: 'bob',
      email: 'bob@example.com',
      password: await bcrypt.hash('bob123', 10),
      isAdmin: false
    }
  ]);

  // Catégories
  const [cpuCategory, gpuCategory, ramCategory] = await Categories.insertMany([
    { name: 'Processeur', slug: 'cpu' },
    { name: 'Carte Graphique', slug: 'gpu' },
    { name: 'Mémoire Vive', slug: 'ram' }
  ]);

  // Partenaires
  const [amazon, ldlc, materiel] = await Partner.insertMany([
    { name: 'Amazon', url: 'https://amazon.fr', commission: 5, conditions: 'Livraison gratuite' },
    { name: 'LDLC', url: 'https://ldlc.com', commission: 4, conditions: 'Garantie 2 ans' },
    { name: 'Materiel.net', url: 'https://materiel.net', commission: 6, conditions: 'Livraison express' }
  ]);

  // Composants
  const components = await Component.insertMany([
    {
      category: cpuCategory._id,
      brand: 'Intel',
      title: 'Intel Core i7 12700K',
      description: 'Processeur haut de gamme',
      model: 'i7-12700K',
      specs: { cores: 12, threads: 20, frequency: '3.6GHz' },
      image: '',
      prices: [
        { partner: amazon._id, price: 320 },
        { partner: ldlc._id, price: 330 }
      ]
    },
    {
      category: gpuCategory._id,
      brand: 'NVIDIA',
      title: 'RTX 4070',
      description: 'GPU gamer haut de gamme',
      model: 'RTX4070',
      specs: { memory: '12GB', bus: '256-bit' },
      image: '',
      prices: [
        { partner: amazon._id, price: 599 },
        { partner: materiel._id, price: 615 }
      ]
    },
    {
      category: ramCategory._id,
      brand: 'Corsair',
      title: 'Corsair Vengeance 16GB DDR4',
      description: 'RAM performante pour gaming et création',
      model: 'CMK16GX4M2B3200C16',
      specs: { capacity: '16GB', speed: '3200MHz' },
      image: '',
      prices: [
        { partner: ldlc._id, price: 80 },
        { partner: materiel._id, price: 85 }
      ]
    }
  ]);

  // Configurations
  await Configuration.insertMany([
    {
      user: users[0]._id,
      name: 'PC Gamer Medium',
      components: [
        { component: components[0]._id, partner: amazon._id },
        { component: components[1]._id, partner: materiel._id }
      ]
    },
    {
      user: users[1]._id,
      name: 'PC Création',
      components: [
        { component: components[0]._id, partner: ldlc._id },
        { component: components[2]._id, partner: materiel._id }
      ]
    },
    {
      user: users[2]._id,
      name: 'PC Bureautique',
      components: [
        { component: components[2]._id, partner: ldlc._id }
      ]
    }
  ]);

  console.log('✅ Base de données peuplée avec succès avec plusieurs jeux de données.');
  process.exit();
};

populate();
