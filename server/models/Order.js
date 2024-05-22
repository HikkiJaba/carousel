const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  options: {
    color: { type: String },
    mirrors: { type: Boolean },
    leds: { type: Boolean },
    kinetics: { type: Boolean }
  },
  totalPrice: { type: Number, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  comments: { type: String },
  status: { type: String, default: 'Pending' },
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
