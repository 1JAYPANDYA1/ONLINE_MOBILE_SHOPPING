const mongoose = require("mongoose");

const ThumbnailSchema = new mongoose.Schema(
  {
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Thumbnail", ThumbnailSchema);
