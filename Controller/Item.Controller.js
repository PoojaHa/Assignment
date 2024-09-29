
const Item = require('../Models/Item.models');
const User = require('../Models/Customer.models');

exports.createItem = async (req, res) => {  //fine
  try {
    const { name, price, quantity, userId } = req.body; 
    const item = new Item({ name, price, quantity, userId }); 
    await item.save(); 
    await User.findByIdAndUpdate(userId, { $addToSet: { items: item._id } });

    res.status(201).json(item); // Return created item
  } catch (error) {
    res.status(400).json({ message: 'Failed to create item', error }); 
  }
};
exports.getAllItems = async (req, res) => {  //fine
  try {
    const items = await Item.find(); // Fetch all items from the database
    res.status(200).json(items); // Return all items
  } catch (error) {
    res.status(400).json({ message: 'Error fetching items', error });
  }
};
exports.getItemsForUser = async (req, res) => { //fine
  try {
    // Use 'userId' if your Item schema has 'userId' field
    const items = await Item.find({ userId: req.params.id }); // Fetch all items for the given user ID
    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching items', error });
  }
};


exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params; // Get the item ID from the request parameters
    const updateData = req.body; // Get the new data to update

    const updatedItem = await Item.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }); // Update the item

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' }); // Item not found
    }

    res.status(200).json(updatedItem); // Return the updated item
  } catch (error) {
    res.status(400).json({ message: 'Failed to update item', error }); // Handle error
  }
};
