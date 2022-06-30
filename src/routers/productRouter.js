const express = require('express');
const Catagory = require('../models/catagoryModel');
const router = express.Router();
const Product = require('../models/productModel');
const multer = require('multer');
const authJwtVerification = require('../helpers/jwtVerify');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('Invalid Image file type.');

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname
      .split(' ')
      .join('-')
      .split('.')
      .join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

//create new Product
router.post(
  '/',
  authJwtVerification,
  uploadOptions.single('image'),
  async (req, res) => {
    try {
      //check posted categary exists on database
      const catagory = await Catagory.findById(req.body.catagory);
      if (!catagory) return res.status(400).send('Invalid catagory.');

      const file = req.file;
      if (!file) return res.status(400).send('No image in this request.');

      const fileName = req.file.filename;
      // http://localhost:8080/public/upload/image-453435
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

      const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`, // http://localhost:8080/public/upload/image-453435
        //images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        catagory: req.body.catagory,
        rating: req.body.rating,
        numReview: req.body.numReview,
        countInStock: req.body.countInStock,
        isFeatured: req.body.isFeatured,
      });
      const createProduct = await product.save();
      res.status(201).send(createProduct);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

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

//Update product images
router.patch(
  '/gallery-images/:id',
  uploadOptions.array('images', 10),
  async (req, res) => {
    try {
      const files = req.files;
      let imagesPaths = [];
      // http://localhost:8080/public/upload/image-453435
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
      // console.log(files);
      if (files) {
        files.map((file) => {
          imagesPaths.push(`${basePath}${file.filename}`);
        });
      }

      const _id = req.params.id;
      const updateProductImages = await Product.findByIdAndUpdate(
        _id,
        { images: imagesPaths },
        {
          new: true,
        }
      );
      res.send(updateProductImages);
    } catch (err) {
      res.status(404).send(err);
    }
  }
);

module.exports = router;
