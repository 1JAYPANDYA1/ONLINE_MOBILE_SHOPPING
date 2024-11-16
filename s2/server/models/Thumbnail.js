const mongoose = require("mongoose");

const ThumbanailSchema = new mongoose.Schema(
  {
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Thumbanail", ThumbanailSchema);