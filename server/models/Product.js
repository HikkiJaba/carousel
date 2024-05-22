const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  basePrice: { type: Number, required: true },
  description: { type: String },
});

module.exports = mongoose.model('Product', ProductSchema);
