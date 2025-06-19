const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  components: [{
    component: { type: mongoose.Schema.Types.ObjectId, ref: 'Component' },
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Configuration', configurationSchema);