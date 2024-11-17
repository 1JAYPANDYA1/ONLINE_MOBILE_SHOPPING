    const mongoose = require("mongoose");

    const PhoneSchema = new mongoose.Schema(
        {
            phone_brand:String,
            phone_name:String,
            ram: Number,
            storage: Number,
            originalprice: Number,
            saleprice: Number,
            stock: Number,
            color: String,
        },
        { timestamps: true }
    );

    module.exports = mongoose.model("phone", PhoneSchema);
