const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true },
  brand: String,
  title: { type: String, required: true },
  description: String,
  model: String,
  specs: Object,
  image: String,
  prices: [{
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
    price: Number
  }]
});

module.exports = mongoose.model('Component', componentSchema);