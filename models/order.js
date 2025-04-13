const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userDetails: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
    address: { type: Object, required: true }
  },
  productDetails: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  paymentDetails: {
    success: { type: Boolean, required: true },
    code: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Object, required: true },
  },
  orderStatus: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered","FAILED","PENDING"],
    required: true,
    default: "Processing"
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
