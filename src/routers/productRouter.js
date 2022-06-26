const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

//create new Product
router.post('/', async (req, res) => {
  try {
    const Product = new Product(req.body);
    const createProduct = await Product.save();
    res.status(201).send(createProduct);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get all Product
router.get('/', async (req, res) => {
  try {
    const productsData = await Product.find();
    res.status(400).send(productsData);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
