// /Models/Order.models.js
const mongoose = require('mongoose');

// Order Schema
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }], 
  totalAmount: { type: Number, required: true }, 
  orderStatus: { type: String, default: 'Pending' }, 
}, { timestamps: true }); 

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
