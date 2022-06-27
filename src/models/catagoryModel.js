const mongoose = require('mongoose');

const catagorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  },
});

const Catagory = new mongoose.model('Catagory', catagorySchema);

module.exports = Catagory;
