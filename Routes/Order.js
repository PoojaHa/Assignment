const express = require('express');
const router = express.Router();
const orderController = require('../Controller/Order.controller');


router.post('/order', orderController.createOrder);
router.get('/order/email/:email', orderController.getOrdersByEmail);
router.get('/orders', orderController.getAllOrders);
router.delete('/order/cancel', orderController.cancelOrder);
router.put('/order/modify-address', orderController.modifyDeliveryAddress);
module.exports = router;
