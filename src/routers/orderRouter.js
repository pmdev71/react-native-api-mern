const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');

// post new order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    const createOrder = await order.save();
    res.status(200).send(createOrder);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get all orders
router.get('/', async (req, res) => {
  try {
    const ordersData = await Order.find();
    res.status(200).send(ordersData);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
