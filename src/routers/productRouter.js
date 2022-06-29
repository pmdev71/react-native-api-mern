const express = require('express');
const Catagory = require('../models/catagoryModel');
const router = express.Router();
const Product = require('../models/productModel');
const authJwtVerification = require('../helpers/jwtVerify');

//create new Product
router.post('/', authJwtVerification, async (req, res) => {
  try {
    //check posted categary exists on database
    const catagory = await Catagory.findById(req.body.catagory);
    if (!catagory) return res.status(400).send('Invalid catagory.');

    const product = new Product(req.body);
    const createProduct = await product.save();
    res.status(201).send(createProduct);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get all Product
// router.get('/', async (req, res) => {
//   try {
//     const productsData = await Product.find().populate('catagory');
//     // get all product with specific field
//     // const productsData = await Product.find().select('name price');
//     res.status(200).send(productsData);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// get all Product if not any query params & if query params then get product or products based on query param 'http://localhost:8080/api/v1/products?catagories=25423543,67345345'
router.get('/', async (req, res) => {
  try {
    // http://localhost:8080/api/v1/products?catagories=25423543,67345345
    let filter = {};
    if (req.query.catagories) {
      filter = { catagory: req.query.catagories.split(',') };
    }

    const productsList = await Product.find(filter).populate('catagory');
    res.status(200).send(productsList);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get single product by id
router.get('/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const productData = await Product.findById(_id).populate('catagory');
    if (!productData) {
      return res.status(400).send();
    }
    res.send(productData);
  } catch (err) {
    res.status(500).send(err);
  }
});

// update product by id using patch
router.patch('/:id', async (req, res) => {
  try {
    //check posted categary exists on database
    const catagory = await Catagory.findById(req.body.catagory);
    if (!catagory) return res.status(400).send('Invalid catagory.');

    const _id = req.params.id;
    const updateProduct = await Product.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.send(updateProduct);
  } catch (err) {
    res.status(404).send(err);
  }
});

// get Product count -- how many product available
router.get('/get/count', async (req, res) => {
  try {
    const productsCount = await Product.countDocuments();
    res.status(200).send({
      productsCount: productsCount,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

// get featured Product which contain "isFeatured: true"
router.get('/get/featured', async (req, res) => {
  try {
    // filter only that product contain "isFeatured: true"
    const products = await Product.find({ isFeatured: true });
    res.status(200).send({
      products,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
