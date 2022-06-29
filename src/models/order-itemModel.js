const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  quantaty: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
});

const OrderItem = new mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;
