const Phone = require("../../models/Phone");
const PhoneImg = require("../../models/PhoneImg");
const Specs = require("../../models/Specs");

const getFilteredProducts = async (req, res) => {
  try {
    const { phone_brand, color, sortBy } = req.query;

    let filters = {};

    // Filtering by brand
    if (phone_brand) {
      filters.phone_brand = { $in: phone_brand.split(",") };
    }

    // Filtering by color
    if (color) {
      filters.color = { $in: color.split(",") };
    }

    // Sorting logic
    let sort = {};

    switch (sortBy) {
      case "saleprice-lowtohigh":
        sort.saleprice = 1;
        break;
      case "saleprice-hightolow":
        sort.saleprice = -1;
        break;
      case "phone_name-atoz":
        sort.phone_name = 1;
        break;
      case "phone_name-ztoa":
        sort.phone_name = -1;
        break;
      default:
        sort.saleprice = 1;
        break;
    }

    // Fetch filtered and sorted products
    const products = await Phone.find(filters).sort(sort);
    console.log(products)
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("i am reached : ",id)
    const product = await Phone.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }
    res.status(200).json({
      success: true,
      data:product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const getPhoneDetails = async (req, res) => {
  const { phoneId } = req.params;
  console.log("in asdf")
  try {
    const phone = await Phone.findById(phoneId);
    const images = await PhoneImg.find({ phoneId:phoneId });
    const specs = await Specs.findOne({ phoneId });

    if (!phone) return res.status(404).json({ message: "Phone not found" });
    console.log("my response : ",{phone,images,specs})
    return res.json({ phone, images, specs });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
module.exports = { getFilteredProducts, getProductDetails,getPhoneDetails };