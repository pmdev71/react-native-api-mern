const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
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
    phone: {
      type: Number,
      min: 11,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      min: 5,
      required: true,
      trim: true,
    },
    balance: {
      type: Number,
      default: 100,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = new mongoose.model('User', userSchema);

module.exports = User;
