const express = require('express');
const itemController = require('../Controller/Item.Controller'); // Adjust the path as necessary

const router = express.Router();

// Route to create a new item
router.post('/items', itemController.createItem);
router.get('/items/:id', itemController.getItemsForUser); 
router.get('/items', itemController.getAllItems);
router.put('/items/:id', itemController.updateItem)

module.exports = router;
