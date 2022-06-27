const express = require('express');
const router = express.Router();
const Catagory = require('../models/catagoryModel');

// post new catagory
router.post('/', async (req, res) => {
  try {
    const catagor = new Catagory(req.body);
    const createCatagor = await catagor.save();
    res.status(200).send(createCatagor);
  } catch (err) {
    res.status(400).send(err);
  }
});

// get all catagory
router.get('/', async (req, res) => {
  try {
    const catagorysList = await Catagory.find();
    res.status(200).send(catagorysList);
  } catch (err) {
    res.status(400).send(err);
  }
});

//delete Catagory by id
router.delete('/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const deleteCatagory = await Catagory.findByIdAndDelete(_id);
    if (!deleteCatagory) {
      return res.status(400).send();
    }
    res.send(deleteCatagory);
    // res
    //   .status(200)
    //   .json({ success: true, message: 'Category delete database.' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// get single catagory by id
router.get('/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const catagoryData = await Catagory.findById(_id);
    if (!catagoryData) {
      return res.status(400).send();
    }
    res.send(catagoryData);
  } catch (err) {
    res.status(500).send(err);
  }
});

// update user by id using patch
router.patch('/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const updateCatagory = await Catagory.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.send(updateCatagory);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
