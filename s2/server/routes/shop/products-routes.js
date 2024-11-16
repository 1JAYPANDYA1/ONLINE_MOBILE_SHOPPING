const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,getPhoneDetails,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);
router.get("/:phoneId", getPhoneDetails);

module.exports = router;
