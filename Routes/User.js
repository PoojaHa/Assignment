const express = require('express');
const userController = require('../Controller/User.Controller'); // Adjust the path as necessary

const router = express.Router();

// Route to create a new user
router.post('/users', userController.createUser);

// Route to get all users
router.get('/users', userController.getAllUsers);

// Route to update a user by ID
router.put('/users/:id', userController.updateUser);

// Route to delete a user by ID
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
