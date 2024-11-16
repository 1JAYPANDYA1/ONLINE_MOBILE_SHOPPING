  const { imageUploadUtil } = require("../../helpers/cloudinary");
  const Phone = require("../../models/Phone");
  const Specs = require("../../models/Specs");
  const PhoneCat = require("../../models/PhoneCat");
  const PhoneImg = require("../../models/PhoneImg");
  const Product = require("../../models/Product");


  const handleImageUpload = async (req, res) => {
    try {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const url = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await imageUploadUtil(url);
      res.json({
        success: true,
        result,
      });
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: "Error occured",
      });
    }
  };

const addProduct = async (req, res) => {
  try {
    const {
      image, // Array of image URLs
      brand, mobilename, // Phone details
      display, processor, antutu, sensor, mp, battery, rr, speaker, // Phone specs
      ram, storage, color, price,saleprice ,totalStock // Phone category details
    } = req.body;

    // Create a new Phone document
    const newPhone = new Phone({
      phone_brand: brand,
      phone_name: mobilename,
      phone_img: image ,
      ram:ram,
      storage:storage,
      originalprice:price,
      saleprice:saleprice,
      stock: totalStock,
      color:color// Use the first image as the main image
    });

    const savedPhone = await newPhone.save();

    // // Create a new PhoneCat document
    // const newPhoneCat = new PhoneCat({
    //   phoneId: savedPhone._id,
    //   ram,
    //   storage,
    //   price,
    //   stock: totalStock,
    //   color
    // });

    // const savedPhoneCat = await newPhoneCat.save();

    // Create PhoneImg documents for multiple images
    // const phoneImages = images.slice(1); // Exclude the first image as it's already used as the main image
    // for (let img of phoneImages) {
    //   const newPhoneImg = new PhoneImg({
    //     phonecatId: savedPhoneCat._id,
    //     color,
    //     img
    //   });
    //   await newPhoneImg.save();
    // }

    // Create a new Specs document
    const newSpecs = new Specs({
      phoneId: savedPhone._id,
      display_type: display,
      processor,
      antutuscore: antutu,
      camera_sensor: sensor,
      camera_mp: mp,
      battery_cap: battery,
      refresh_rate: rr,
      speaker
    });

    await newSpecs.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        phone: savedPhone,
        // category: savedPhoneCat,
        // images: phoneImages,
        specs: newSpecs
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred while adding the product",
    });
  }
};



  const fetchAllProducts = async (req, res) => {
    try {
      const listOfProducts = await Phone.find({});
      res.status(200).json({
        success: true,
        data: listOfProducts,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Error occured",
      });
    }
  };

  // const editProduct = async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const {
  //       image, // Phone images
  //       brand, mobilename, // Phone details
  //       display, processor, antutu, sensor, mp, battery, rr, speaker, // Phone specs
  //       ram, storage, color, price, totalStock // Phone category details
  //     } = req.body;

  //     // Find the phone by ID
  //     const phone = await Phone.findById(id);
  //     if (!phone) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Phone not found",
  //       });
  //     }

  //     // Update the Phone document
  //     phone.phone_brand = brand || phone.phone_brand;
  //     phone.phone_name = mobilename || phone.phone_name;
  //     phone.phone_img = image || phone.phone_img;

  //     const updatedPhone = await phone.save(); // Save the updated phone

  //     // Find or create the PhoneCat document
  //     // let phoneCat = await PhoneCat.findOne({ phoneId: id });
  //     // if (!phoneCat) {
  //     //   phoneCat = new PhoneCat({
  //     //     phoneId: updatedPhone._id,
  //     //   });
  //     // }

  //     // phoneCat.ram = ram || phoneCat.ram;
  //     // phoneCat.storage = storage || phoneCat.storage;
  //     // phoneCat.price = price || phoneCat.price;
  //     // phoneCat.stock = totalStock || phoneCat.stock;
  //     // phoneCat.color = color || phoneCat.color;

  //     // const updatedPhoneCat = await phoneCat.save(); // Save the updated phone category

  //     // // Remove existing PhoneImg documents
  //     // await PhoneImg.deleteMany({ phonecatId: updatedPhoneCat._id });

  //     // // Create or update PhoneImg documents for multiple images
  //     // const phoneImages = [image2, image3, image4, image5].filter(img => img);
  //     // for (let img of phoneImages) {
  //     //   const newPhoneImg = new PhoneImg({
  //     //     phonecatId: updatedPhoneCat._id,
  //     //     color,
  //     //     img
  //     //   });
  //     //   await newPhoneImg.save(); // Save each image
  //     // }

  //     // Find or create the Specs document
  //     let specs = await Specs.findOne({ phoneId: id });
  //     if (!specs) {
  //       specs = new Specs({
  //         phoneId: updatedPhone._id,
  //       });
  //     }

  //     specs.display_type = display || specs.display_type;
  //     specs.processor = processor || specs.processor;
  //     specs.antutuscore = antutu || specs.antutuscore;
  //     specs.camera_sensor = sensor || specs.camera_sensor;
  //     specs.camera_mp = mp || specs.camera_mp;
  //     specs.battery_cap = battery || specs.battery_cap;
  //     specs.refresh_rate = rr || specs.refresh_rate;
  //     specs.speaker = speaker || specs.speaker;

  //     const updatedSpecs = await specs.save(); // Save the updated specs

  //     res.status(200).json({
  //       success: true,
  //       message: "Product updated successfully",
  //       data: {
  //         phone: updatedPhone,
  //         category: updatedPhoneCat,
  //         images: phoneImages,
  //         specs: updatedSpecs
  //       }
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({
  //       success: false,
  //       message: "Error occurred while updating the product",
  //     });
  //   }
  // };


  const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;

      // Find and delete the Product document
      const product = await Phone.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Find and delete the associated Phone document
      const phone = await Phone.findOneAndDelete({ _id: product.phoneId });

      if (phone) {
        // Delete associated PhoneCat documents
        // await PhoneCat.deleteMany({ phoneId: phone._id });

        // Delete associated PhoneImg documents
        await Specs.deleteMany({ phoneId: product._id });
      }

      // Delete the Product document
      await Phone.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Product and related data deleted successfully",
      });
    } catch (e) {
      console.error(e); // Changed from `console.log` to `console.error` for better error logging
      res.status(500).json({
        success: false,
        message: "Error occurred while deleting the product",
      });
    }
  };

  module.exports = {
    handleImageUpload,
    addProduct,
    fetchAllProducts,
    // editProduct,
    deleteProduct,
  };
