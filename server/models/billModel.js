const mongoose = require("mongoose");

const billSchema = mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerContact: {
      type: Number,
      required: true,
    },
    subTotal: {
        type: Number,
        required: true,
      },
    totalAmount: {
      type: Number,
      required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    paymentMode: {
      type: String,
      required: true,
    },
    cartItems: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
    },
  },
  { timestamp: true }
);

const Bills = mongoose.model("Bills", billSchema);

module.exports = Bills;