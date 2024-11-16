const express = require("express");

const {
  addThumbnailImage,
  getThumbnailImages,
} = require("../../controllers/common/Thumbnail-controller");

const router = express.Router();

router.post("/add", addThumbnailImage);
router.get("/get", getThumbnailImages);

module.exports = router;
