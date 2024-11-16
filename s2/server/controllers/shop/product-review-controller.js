const Order = require("../../models/Order");
const Phone= require("../../models/Phone");
const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

    // Check if the user has purchased the product
    const order = await Order.findOne({
      userId,
      "cartItems.phoneId": productId,
      orderStatus: { $in: ["confirmed", "delivered"] }, // Use $in for array checking
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase this product to review it.",
      });
    }

    // Check if the user has already reviewed the product
    const checkExistingReview = await ProductReview.findOne({
      phoneId: productId,
      userId: userId,
    });

    if (checkExistingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product!",
      });
    }

    // Create a new review
    const newReview = new ProductReview({
      phoneId: productId,
      userId: userId,
      userName: userName,
      reviewMessage: reviewMessage,
      reviewValue: reviewValue,
    });

    await newReview.save();

    // Calculate average review value
    const reviews = await ProductReview.find({ phoneId: productId });
    const totalReviewsLength = reviews.length;

    let averageReview = 0;
    if (totalReviewsLength > 0) {
      averageReview =
        reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        totalReviewsLength;
    }

    await Phone.findByIdAndUpdate(productId, { averageReview });

    // Send successful response
    res.status(201).json({
      success: true,
      message: "Review added successfully!",
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the review.",
    });
  }
};


const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // const reviews = await ProductReview.find({ productId });
    const reviews = await ProductReview.find({ phoneId: productId });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addProductReview, getProductReviews };
