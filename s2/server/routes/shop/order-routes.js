const express = require("express");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  verifyPayment
} = require("../../controllers/shop/order-controller");

const router = express.Router();
router.post('/create-order',createOrder);
router.post('/verify-payment', verifyPayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;