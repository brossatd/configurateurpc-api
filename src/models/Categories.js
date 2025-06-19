const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true, sparse: true }
});

module.exports = mongoose.model('Categories', categoriesSchema);