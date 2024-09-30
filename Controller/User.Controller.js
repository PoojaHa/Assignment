const User = require('../Models/Customer.models');
const mongoose = require('mongoose');

// In-memory storage for users
let usersInMemory = {}; // Using an object for in-memory storag

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    // Store the created user in memory as well
    usersInMemory[user._id] = user;
    console.log(usersInMemory)
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create user', error });
  }
};

// Get all users (MongoDB)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('items'); // Fetch all users from MongoDB
    res.status(200).json(users); // Return the list of users
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Update user (MongoDB)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update the in-memory storage as well
    usersInMemory[user._id] = user;

    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a user by ID (MongoDB)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Remove the user from in-memory storage
    delete usersInMemory[user._id];

    res.status(204).send("User deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAllUsersInMemory = (req, res) => {
  res.status(200).json(Object.values(usersInMemory)); // Return the list of users from memory
};
