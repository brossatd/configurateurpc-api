const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
  price: { type: Number, required: true }
});

const componentSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true },
  brand: String,
  title: { type: String, required: true },
  description: String,
  model: String,
  specs: Object,
  image: String,
  prices: [priceSchema]
});

module.exports = mongoose.model('Component', componentSchema);