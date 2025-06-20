const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  url: String,
  commission: Number,
  conditions: String
});

module.exports = mongoose.model('Partner', partnerSchema);