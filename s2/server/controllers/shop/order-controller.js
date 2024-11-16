const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Phone = require("../../models/Phone");
// const Product = require("../../models/Phone");

// const createOrder = async (req, res) => {
//   try {
//     const {
//       userId,
//       cartItems,
//       addressInfo,
//       orderStatus,
//       paymentMethod,
//       paymentStatus,
//       totalAmount,
//       orderDate,
//       orderUpdateDate,
//       paymentId,
//       payerId,
//       cartId,
//     } = req.body;

//     const create_payment_json = {
//       intent: "sale",
//       payer: {
//         payment_method: "razorpay",
//       },
//       redirect_urls: {
//         return_url: "http://localhost:5173/shop/paypal-return",
//         cancel_url: "http://localhost:5173/shop/paypal-cancel",
//       },
//       transactions: [
//         {
//           item_list: {
//             items: cartItems.map((item) => ({
//               sku: item.phoneId,
//               price: item.amount.toFixed(2),
//               currency: "USD",
//               quantity: item.quantity,
//             })),
//           },
//           amount: {
//             currency: "USD",
//             total: totalAmount.toFixed(2),
//           },
//           description: "description",
//         },
//       ],
//     };

//     paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
//       if (error) {
//         console.log(error);

//         return res.status(500).json({
//           success: false,
//           message: "Error while creating paypal payment",
//         });
//       } else {
//         const newlyCreatedOrder = new Order({
//           userId,
//           cartId,
//           cartItems,
//           addressInfo,
//           orderStatus,
//           paymentMethod,
//           paymentStatus,
//           totalAmount,
//           orderDate,
//           orderUpdateDate,
//           paymentId,
//           payerId,
//         });

//         await newlyCreatedOrder.save();

//         const approvalURL = paymentInfo.links.find(
//           (link) => link.rel === "approval_url"
//         ).href;

//         res.status(201).json({
//           success: true,
//           approvalURL,
//           orderId: newlyCreatedOrder._id,
//         });
//       }
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// const capturePayment = async (req, res) => {
//   try {
//     const { paymentId, payerId, orderId } = req.body;

//     let order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order can not be found",
//       });
//     }

//     order.paymentStatus = "paid";
//     order.orderStatus = "confirmed";
//     order.paymentId = paymentId;
//     order.payerId = payerId;

//     for (let item of order.cartItems) {
//       let product = await Product.findById(item.productId);

//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: `Not enough stock for this product ${product.title}`,
//         });
//       }

//       product.totalStock -= item.quantity;

//       await product.save();
//     }

//     const getCartId = order.cartId;
//     await Cart.findByIdAndDelete(getCartId);

//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Order confirmed",
//       data: order,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_pVMPiZnpHDsa6g', // Replace with your Razorpay key
  key_secret: '0ZiI8iZ185Dx20ZY9S1Mck12', // Replace with your Razorpay secret
});

// Controller for creating an order
const createOrder = async (req, res) => {
  const { userId, cartItems, addressInfo, totalAmount, cartId } = req.body;

  try {
    // Create Razorpay order with amount in paise
    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    console.log("cart items ",cartItems)

    // Save the order details to your database
    const newOrder = new Order({
      userId,
      cartId,
      cartItems: cartItems.map(item => ({
        phoneId: item.productId, // Make sure to extract productId
        quantity: item.quantity,
        amount: item.amount,
      })),
      addressInfo,
      orderStatus: 'Pending',
      paymentMethod: 'Razorpay',
      paymentStatus: 'Paid',
      totalAmount,
      orderDate: new Date(),
    });
    console.log(cartItems)

    await newOrder.save();
    for (const item of cartItems) {
      await Phone.updateOne(
        { _id: item.productId }, // Find the phone by productId
        { $inc: { stock: -item.quantity } } // Decrease the stock by the ordered quantity
      );
    }
    await Cart.deleteOne({ _id: cartId });  // Assuming cartId is passed in req.body and used as the identifier

    // Return Razorpay order details to the frontend
    res.status(201).json({
      success: true,
      razorpayOrderId: order.id,
      orderId: newOrder._id,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error creating Razorpay order' });
  }
};

// Controller for verifying the payment
const verifyPayment = async(req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  console.log("aatyo")
  // Validate signature using HMAC SHA256
  const hmac = crypto.createHmac('sha256', '0ZiI8iZ185Dx20ZY9S1Mck12'); // Replace with your actual Razorpay secret key
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);

    try {
      // Update order status to 'Paid' in the database
      const updatedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: 'Paid',
          orderStatus: 'Completed',
          paymentId: razorpay_payment_id,
        },
        { new: true } // Return the updated order
      );

      if (!updatedOrder) {
        return res.status(500).json({
          success: false,
          message: 'Order not found or update failed',
        });
      }

      res.json({ success: true, message: 'Payment verified', orderId: updatedOrder._id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error updating order',
      });
    }
  
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  // capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
