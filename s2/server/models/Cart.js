const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        phoneId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "phone",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", CartSchema);
