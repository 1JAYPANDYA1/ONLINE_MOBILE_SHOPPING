const mongoose = require("mongoose");

const SpecsSchema = new mongoose.Schema(
    {
        phoneId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "phone",
            required: true,
        }, 
        display_type:String,
        processor:String,
        antutuscore:Number,
        camera_sensor: String,
        camera_mp:Number,
        battery_cap:Number,
        refresh_rate:Number,
        speaker:String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Specs", SpecsSchema);
