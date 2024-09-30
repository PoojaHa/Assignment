const Order = require('../Models/Order.models');
const Item = require('../Models/Item.models');
const User = require('../Models/Customer.models');
let ordersInMemory = []; // Store orders in memory
// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { name, email, deliveryAddress, items } = req.body;
    // Find or create the user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, deliveryAddress });
      await user.save();
    }
    const totalAmount = await calculateTotalAmount(items);

    const deliveryTime = assignDeliveryTime();
    const order = new Order({
      user: user._id,
      items,
      totalAmount,
      deliveryTime,
      deliveryAddress,
    });
    await order.save();
    ordersInMemory.push(order);

    res.status(201).json({
      message: "Order placed successfully",
      order,
      deliveryDetails: { deliveryTime }
    });
  } catch (error) {
    res.status(400).json({ message: 'Failed to place order', error: error.message });
  }
};

const calculateTotalAmount = async (itemIds) => {
  const items = await Item.find({ _id: { $in: itemIds } });
  if (items.length === 0) {
    throw new Error("No valid items found for the provided item IDs.");
  }

  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Function to assign a delivery time (e.g., 1 hour from now)
const assignDeliveryTime = () => {
  const now = new Date();
  return new Date(now.getTime() + 60 * 60 * 1000);
};

// Get orders by email
exports.getOrdersByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userOrders = await Order.find({ user: user._id }).populate('items');
    if (!userOrders.length) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(userOrders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find().populate('items');
    if (!allOrders.length) {
      return res.status(404).json({ message: 'No orders found' });
    }
    res.status(200).json(allOrders);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching orders', error });
  }
};


exports.cancelOrder = async (req, res) => {
  const { email, orderId } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const order = await Order.findOneAndDelete({ _id: orderId, user: user._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found or not associated with this user' });
    }

    res.status(200).json({ message: 'Order canceled successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to cancel order', error });
  }
};


exports.modifyDeliveryAddress = async (req, res) => {
  const { email, orderId, newDeliveryAddress } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, user: user._id },
      { deliveryAddress: newDeliveryAddress },
  
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found or not associated with this user' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Failed to modify delivery address', error });
  }
};
