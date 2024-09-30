
const Item = require('../Models/Item.models');
const User = require('../Models/Customer.models');

let itemsInMemory = {}; 
let currentItemId = 1; 

exports.createItem = async (req, res) => {
  try {
    const { name, price, quantity, userId } = req.body;
    const item = new Item({ name, price, quantity, userId });
    await item.save();

    // Store the created item in memory as well
    itemsInMemory[item._id] = item;

    itemsInMemory[currentItemId++] = item;

    await User.findByIdAndUpdate(userId, { $addToSet: { items: item._id } });

    res.status(201).json(item); 
  } catch (error) {
    res.status(400).json({ message: 'Failed to create item', error });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find(); // Fetch all items from the database
    res.status(200).json(items); // Return all items
  } catch (error) {
    res.status(400).json({ message: 'Error fetching items', error });
  }
};

// Get items for a specific user (MongoDB)
exports.getItemsForUser = async (req, res) => {
  try {
    const items = await Item.find({ userId: req.params.id }); // Fetch all items for the given user ID
    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching items', error });
  }
};

// Update iongoDB)tem (M
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params; // Get the item ID from the request parameters
    const updateData = req.body; // Get the new data to update

    const updatedItem = await Item.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }); // Update the item

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update the in-memory storage as well
    itemsInMemory[updatedItem._id] = updatedItem;

    res.status(200).json(updatedItem); 
  } catch (error) {
    res.status(400).json({ message: 'Failed to update item', error });
  }
};

// Optional: Get all items from memory
exports.getAllItemsInMemory = (req, res) => {
  res.status(200).json(Object.values(itemsInMemory)); // Return all items from memory
};
