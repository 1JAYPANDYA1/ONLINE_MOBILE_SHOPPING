const mongoose = require("mongoose");

const PhoneImgSchema = new mongoose.Schema(
    {
        phonecatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "phone_cat",
            required: true,
        },
        color: { type: String, ref: 'phone_cat', required: true },
        img: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("phone_img", PhoneImgSchema);
