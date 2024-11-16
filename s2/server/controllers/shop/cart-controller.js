const Cart = require("../../models/Cart");
const Phone = require("../../models/Phone");

const addToCart = async (req, res) => {
  console.log("Cart Controller - Received request body:", req.body);
  try {
    const { userId, phoneId, quantity, price } = req.body;
    console.log("Cart Controller - Destructured data:", { userId, phoneId, quantity, price });

    if (!userId || !phoneId || !quantity || quantity <= 0 || !price) {
      console.log("Cart Controller - Invalid data provided:", { userId, phoneId, quantity, price });
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
        receivedData: { userId, phoneId, quantity, price }
      });
    }

    const product = await Phone.findById(phoneId);

    if (!product) {
      console.log("Cart Controller - Product not found:", phoneId);
      return res.status(404).json({
        success: false,
        message: "Product not found",
        phoneId
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.phoneId.toString() === phoneId
    );

    if (findCurrentProductIndex === -1) {
      const amount = price * quantity;
      cart.items.push({ phoneId, quantity, amount });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
      cart.items[findCurrentProductIndex].amount += price * quantity;
    }

    await cart.save();
    console.log("Cart Controller - Cart updated successfully:", cart);
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Cart Controller - Error:", error);
    res.status(500).json({
      success: false,
      message: "Error",
      error: error.message
    });
  }
};


const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is mandatory!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.phoneId",
      model: "phone",
      select: "phone_brand phone_name phone_img ram storage originalprice saleprice stock color",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const validItems = cart.items.filter(
      (item) => item.phoneId
    );

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      phoneId: item.phoneId._id,
      phone_brand: item.phoneId.phone_brand,
      phone_name: item.phoneId.phone_name,
      phone_img: item.phoneId.phone_img,
      ram: item.phoneId.ram,
      storage: item.phoneId.storage,
      originalprice: item.phoneId.originalprice,
      saleprice: item.phoneId.saleprice,
      stock: item.phoneId.stock,
      color: item.phoneId.color,
      quantity: item.quantity,
      amount: item.amount,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
      error: error.message,
    });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const phoneId=productId
    console.log(phoneId)

    if (!userId || !phoneId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }
    const saleprice = await Phone.findOne({ _id: phoneId }, { saleprice: 1 });
    const sp=saleprice.saleprice
    console.log(saleprice)
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.phoneId.toString() === phoneId
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present!",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    cart.items[findCurrentProductIndex].amount = quantity*sp;
    await cart.save();

    await cart.populate({
      path: "items.phoneId",
      model: "phone",
      select: "phone_brand phone_name phone_img ram storage originalprice saleprice stock color",
    });

    const populateCartItems = cart.items.map((item) => ({
      phoneId: item.phoneId._id,
      phone_brand: item.phoneId.phone_brand,
      phone_name: item.phoneId.phone_name,
      phone_img: item.phoneId.phone_img,
      ram: item.phoneId.ram,
      storage: item.phoneId.storage,
      originalprice: item.phoneId.originalprice,
      saleprice: item.phoneId.saleprice,
      stock: item.phoneId.stock,
      color: item.phoneId.color,
      quantity: item.quantity,
      amount: item.amount,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
      error: error.message,
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const phoneId = productId
    console.log(phoneId)
    if (!userId || !phoneId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.phoneId.toString() !== phoneId
    );

    await cart.save();

    await cart.populate({
      path: "items.phoneId",
      model: "phone",
      select: "phone_brand phone_name phone_img ram storage originalprice saleprice stock color",
    });

    const populateCartItems = cart.items.map((item) => ({
      phoneId: item.phoneId._id,
      phone_brand: item.phoneId.phone_brand,
      phone_name: item.phoneId.phone_name,
      phone_img: item.phoneId.phone_img,
      ram: item.phoneId.ram,
      storage: item.phoneId.storage,
      originalprice: item.phoneId.originalprice,
      saleprice: item.phoneId.saleprice,
      stock: item.phoneId.stock,
      color: item.phoneId.color,
      quantity: item.quantity,
      amount: item.amount,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
      error: error.message,
    });
  }
};

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
};
