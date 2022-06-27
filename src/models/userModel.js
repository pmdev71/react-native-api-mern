const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: [true, 'Email already regidstired !'],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid Email !');
      }
    },
  },
  color: {
    type: String,
    default: '',
  },
  phone: {
    type: Number,
    min: 11,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    min: 5,
    required: true,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  balance: {
    type: Number,
    default: 100,
    required: true,
  },
  city: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: 'BD',
  },
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
