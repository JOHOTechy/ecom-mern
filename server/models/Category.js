const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, default: '' },
  color: { type: String, default: '#8B5CF6' }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
