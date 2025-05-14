const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,  // Correct usage of Schema
    ref: "persona",
    required: true,
  },
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,  // Correct usage of Schema
    ref: "menu",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  orderCode: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
