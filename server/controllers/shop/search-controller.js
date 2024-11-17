const Phone = require("../../models/Phone");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        succes: false,
        message: "Keyword is required and must be in string format",
      });
    }

    const regEx = new RegExp(keyword, "i");

    const createSearchQuery = {
      $or: [
        { phone_brand: regEx },
        { phone_name: regEx },
      ],
    };

    console.log(createSearchQuery)
    const searchResults = await Phone.find(createSearchQuery);
    console.log(searchResults)

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { searchProducts };
