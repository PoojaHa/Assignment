// /Models/Item.models.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 }, // Quantity of the item
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the user who owns the item
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
