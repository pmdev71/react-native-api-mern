const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// create new user/ Registration
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    const createUser = await user.save();
    res.status(201).send(createUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// git all user
router.get('/', async (req, res) => {
  try {
    const usersData = await User.find();
    res.status(200).send(usersData);
  } catch (err) {
    res.status(500).send(err);
  }
});

// get single user by id
router.get('/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const userData = await User.findById(_id);
    if (!userData) {
      return res.status(400).send();
    }
    res.send(userData);
  } catch (err) {
    res.status(500).send(err);
  }
});

// update user by id using patch
router.patch('/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const updateUser = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.send(updateUser);
  } catch (err) {
    res.status(404).send(err);
  }
});

//delete user by id
router.delete('/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const deleteUser = await User.findByIdAndDelete(_id);
    if (!deleteUser) {
      return res.status(400).send();
    }
    res.send(deleteUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
