
const express = require('express');
const router = express.Router();
const OrderController = require('../Controller/Order.controller');

router.post('/orders', OrderController.createOrder);
router.get('/orders', OrderController.getAllOrders);
router.get('/orders/:userId', OrderController.getOrdersByUserId); //specific user orderId And userId

router.put('/orders/:orderId', OrderController.modifyOrder);

module.exports = router;
