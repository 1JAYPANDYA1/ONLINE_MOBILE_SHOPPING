const mongoose = require("mongoose");

const PhoneImgSchema = new mongoose.Schema(
    {
        phoneId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "phone",
            required: true,
        }, 
        color:String,
        img: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("phone_img", PhoneImgSchema);
