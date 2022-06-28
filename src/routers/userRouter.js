const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authJwtVerification = require('../helpers/jwtVerify');

// create new user/ Registration
router.post('/', async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      color: req.body.color,
      phone: req.body.phone,
      password: bcrypt.hashSync(req.body.password, 10),
      isAdmin: req.body.isAdmin,
      balance: req.body.balance,
      city: req.body.city,
      country: req.body.country,
    });
    const createUser = await user.save();
    res.status(201).send(createUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// user login
router.post('/login', async (req, res) => {
  try {
    const secret = process.env.TOKEN_SECRET;
    const userData = await User.findOne({ email: req.body.email });
    if (!userData) {
      return res.status(400).send('The user not found !');
    }

    if (userData && bcrypt.compareSync(req.body.password, userData.password)) {
      const token = jwt.sign(
        {
          userID: userData._id,
          isAdmin: userData.isAdmin,
          userName: userData.name,
        },
        secret,
        {
          expiresIn: '1d',
        }
      );

      return res.status(200).send({ userData: userData.email, token: token });
    } else {
      res.status(400).send('Wrong Password !');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// git all user
router.get('/', authJwtVerification, async (req, res) => {
  try {
    const usersData = await User.find().select('-password');
    res.status(200).send(usersData);
  } catch (err) {
    res.status(500).send(err);
  }
});

// get single user by id
router.get('/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const userData = await User.findById(_id).select('-password');
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
