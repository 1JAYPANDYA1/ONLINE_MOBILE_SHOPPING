const mongoose = require("mongoose");

const UserPurchaseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        phoneId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "phone",
            required: true,
        },
        quantity: Number,
        storage: Number,
        amount: Number,
        status: Number,
        date: Date,
    },
    { timestamps: true }
);

module.exports = mongoose.model("user_purchases", UserPurchaseSchema);
