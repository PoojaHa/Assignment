// /controllers/user.controller.js
const User = require('../Models/Customer.models');
const mongoose = require('mongoose');

exports.createUser = async (req, res) => {  //fine
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create user', error });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => { //fine
  try {
    const users = await User.find().populate('items'); // Fetch all users and populate items
    res.status(200).json(users); // Return the list of users
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.updateUser = async (req, res) => { //fine
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => { //fine
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(204).send("user deleted sucessfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

