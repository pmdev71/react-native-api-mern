const express = require('express');
const OrderItem = require('../models/order-itemModel');
const router = express.Router();
const Order = require('../models/orderModel');
const authJwtVerification = require('../helpers/jwtVerify');

// post new order
router.post('/', authJwtVerification, async (req, res) => {
  try {
    const orderItemsIds = Promise.all(
      req.body.orderItems.map(async (orderitem) => {
        let newOrderItem = new OrderItem({
          quantaty: orderitem.quantaty,
          product: orderitem.product,
        });
        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
      })
    );
    const orderItemsIdsResolved = await orderItemsIds;
    // console.log(orderItemsIdsResolved);
    const totalPrices = await Promise.all(
      orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          'product',
          'price'
        );
        const totalPrice = orderItem.product.price * orderItem.quantaty;
        return totalPrice;
      })
    );
    const totalPriceAfterMarge = totalPrices.reduce((a, b) => a + b, 0);

    const order = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress: req.body.shippingAddress,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPriceAfterMarge,
      user: req.body.user,
    });

    const createOrder = await order.save();
    res.status(200).send(createOrder);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get all orders
router.get('/', async (req, res) => {
  try {
    const ordersData = await Order.find()
      .populate('user', '-password')
      .sort({ dateOrdered: -1 });
    res.status(200).send(ordersData);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get single order by id
router.get('/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const orderData = await Order.findById(_id)
      .populate('user', '-password')
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          populate: 'catagory',
        },
      });
    if (!orderData) {
      return res.status(400).send();
    }
    res.send(orderData);
  } catch (err) {
    res.status(500).send(err);
  }
});

// update order status only by id using patch
router.patch('/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const updateOrderStatus = await Order.findByIdAndUpdate(
      _id,
      { status: req.body.status },
      {
        new: true,
      }
    );
    res.send(updateOrderStatus);
  } catch (err) {
    res.status(404).send(err);
  }
});

//delete order by id
router.delete('/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const deleteOrder = await Order.findByIdAndDelete(_id);
    if (!deleteOrder) {
      return res.status(400).send();
    }
    res.send(deleteOrder);
  } catch (err) {
    res.status(500).send(err);
  }
});

// get total sales amount
router.get('/get/totalsales', async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } },
    ]);
    if (!totalSales) {
      return res.status(400).send();
    }
    res.send({ totalsales: totalSales.pop().totalsales });
  } catch (err) {
    res.status(500).send(err);
  }
});

// get order count -- how much order available
router.get('/get/count', async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();
    res.status(200).send({
      orderCount: orderCount,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// get all orders by a single user using user id
router.get('/get/userorders/:userid', async (req, res) => {
  try {
    const userOrdersData = await Order.find({ user: req.params.userid })
      .populate({
        path: 'orderItems',
        populate: {
          path: 'product',
          populate: 'catagory',
        },
      })
      .sort({ dateOrdered: -1 });
    res.status(200).send(userOrdersData);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
