
const Order = require('../Models/Order.models');
const Item = require('../Models/Item.models');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body; // Expecting userId and array of item IDs
    console.log("Creating order for user:", userId, "with items:", items); // Log for debugging

    const totalAmount = await calculateTotalAmount(items); // Calculate total amount

    const order = new Order({ user: userId, items, totalAmount }); // Create new order
    await order.save(); // Save to DB

    res.status(201).json(order); // Return created order
  } catch (error) {
    console.error("Error creating order:", error); // Log the error for debugging
    res.status(400).json({ message: 'Failed to create order', error: error.message });
  }
};

// Function to calculate total amount
const calculateTotalAmount = async (itemIds) => {
  const items = await Item.find({ _id: { $in: itemIds } }); // Fetch all items
  console.log("Fetched items for total calculation:", items); // Log fetched items for debugging

  if (items.length === 0) {
    throw new Error("No valid items found for the provided item IDs.");
  }

  return items.reduce((total, item) => total + (item.price * item.quantity), 0); // Calculate total
};


// Get all orders for a specific user
exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('items');
    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }
    res.status(200).json(orders); // Return orders
  } catch (error) {
    res.status(400).json({ message: 'Error fetching orders', error });
  }
};



exports.modifyOrder = async (req, res) => {
  const { orderId } = req.params; // Extract orderId from the URL
  const updates = req.body; // Get updates from the request body

  try {
    const order = await Order.findByIdAndUpdate(orderId, updates, {
      new: true, // Return the updated document
      runValidators: true // Validate the updated fields
    }).populate('items.itemId'); // Populate item details

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order); // Return the updated order
  } catch (error) {
    res.status(400).json({ message: 'Failed to update order', error });
  }
};




exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.itemId'); // Populate item details
    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found' });
    }
    res.status(200).json(orders); // Return all orders
  } catch (error) {
    res.status(400).json({ message: 'Error fetching orders', error });
  }
};
