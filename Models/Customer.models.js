
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }] // Reference to Item model
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
