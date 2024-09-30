const express = require('express');
const userController = require('../Controller/User.Controller'); // Adjust the path as necessary

const router = express.Router();


router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
