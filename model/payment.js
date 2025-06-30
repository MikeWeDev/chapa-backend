const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  tx_ref: {
    type: String,
    required: true,
    unique: true,   // ensure tx_ref is unique for each payment
  },
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
