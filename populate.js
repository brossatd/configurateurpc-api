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

const generateComponents = (categoryId, brandPrefix, titles, specsList, partners) => {
  return titles.map((title, i) => ({
    category: categoryId,
    brand: brandPrefix,
    title,
    description: `${title} - composant de haute performance`,
    model: `${brandPrefix}-${i + 1}`,
    specs: specsList[i],
    image: '',
    prices: [
      { partner: partners[0]._id, price: 100 + i * 10 },
      { partner: partners[1]._id, price: 110 + i * 10 }
    ]
  }));
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
  const categoryData = [
    { name: 'Processeur', slug: 'cpu' },
    { name: 'Carte Graphique', slug: 'gpu' },
    { name: 'Mémoire Vive', slug: 'ram' },
    { name: 'Stockage SSD', slug: 'ssd' },
    { name: 'Alimentation', slug: 'alm' },
    { name: 'Boîtier', slug: 'boi' },
    { name: 'Carte Mère', slug: 'ctm' },
    { name: 'Utilitaires', slug: 'utl' }
  ];
  const categories = await Categories.insertMany(categoryData);

  // Partenaires
  const [amazon, ldlc, materiel] = await Partner.insertMany([
    { name: 'Amazon', url: 'https://amazon.fr', commission: 5, conditions: 'Livraison gratuite' },
    { name: 'LDLC', url: 'https://ldlc.com', commission: 4, conditions: 'Garantie 2 ans' },
    { name: 'Materiel.net', url: 'https://materiel.net', commission: 6, conditions: 'Livraison express' }
  ]);

  // Composants (5 par catégorie)
  const allComponents = [];
  const titles = ['A', 'B', 'C', 'D', 'E'];
  categories.forEach((cat, index) => {
    const specsList = Array.from({ length: 5 }, (_, i) => ({ prop: `${cat.slug}-spec-${i + 1}` }));
    const comps = generateComponents(cat._id, cat.slug.toUpperCase(), titles.map(t => `${cat.name} ${t}`), specsList, [amazon, ldlc]);
    allComponents.push(...comps);
  });

  const components = await Component.insertMany(allComponents);

  // Configurations simples pour test
  await Configuration.insertMany([
    {
      user: users[0]._id,
      name: 'Setup 1',
      components: [
        { component: components[0]._id, partner: amazon._id },
        { component: components[5]._id, partner: ldlc._id }
      ]
    },
    {
      user: users[1]._id,
      name: 'Setup 2',
      components: [
        { component: components[10]._id, partner: amazon._id },
        { component: components[15]._id, partner: ldlc._id }
      ]
    }
  ]);

  console.log('✅ Base de données peuplée avec succès avec 5 composants par catégorie.');
  process.exit();
};

populate();
// Exécute le script
// node populate.js
