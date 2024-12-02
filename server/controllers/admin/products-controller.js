const { imageUploadUtil } = require("../../helpers/cloudinary");
const Phone = require("../../models/Phone");
const Specs = require("../../models/Specs");
// const PhoneCat = require("../../models/PhoneCat");
const PhoneImg = require("../../models/PhoneImg");
const { IncomingForm } = require('formidable');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv')

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET // Replace with your Cloudinary API secret
});


const handleImageUpload = async (req, res) => {
  console.log("upload the image")
  const form = new IncomingForm({ multiples: true }); // Enable multiple file uploads
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const imageUrls = [];
    const uploadPromises = [];

    // Check if there are any uploaded files
    if (files && Object.keys(files).length > 0) {
      // Iterate through the uploaded files
      for (const [key, file] of Object.entries(files)) {
        const filesToUpload = Array.isArray(file) ? file : [file];
        for (const f of filesToUpload) {
          uploadPromises.push(
            cloudinary.uploader.upload(f.filepath, {
              // folder: 'uploads', // Optional: specify a Cloudinary folder
            })
          );
        }
      }

      try {
        const uploadResults = await Promise.all(uploadPromises);
        uploadResults.forEach((result) => {
          imageUrls.push(result.secure_url);
        });

        res.status(200).json({ message: 'Images uploaded successfully', imageUrls });
      } catch (uploadError) {
        res.status(500).json({ error: uploadError.message });
      }
    } else {
      return res.status(400).json({ message: 'No images provided' });
    }
  });
};

const addProduct = async (req, res) => {
  try {
    const {
      images, // Array of image URLs
      brand, mobilename, // Phone details
      display, processor, antutu, sensor, mp, battery, rr, speaker, // Phone specs
      ram, storage, color, price, saleprice, totalStock // Phone category details
    } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Create a new Phone document
    const newPhone = new Phone({
      phone_brand: brand,
      phone_name: mobilename,
      storage: storage,
      originalprice: price,
      saleprice: saleprice,
      stock: totalStock,
      color: color
    });

    const savedPhone = await newPhone.save();

    // Create PhoneImg documents for multiple images
    const phoneImages = images; // Exclude the first image as it's already used as the main image
    const phoneImgPromises = phoneImages.map(img => {
      const newPhoneImg = new PhoneImg({
        phoneId: savedPhone._id,
        color,
        img
      });
      return newPhoneImg.save();
    });

    await Promise.all(phoneImgPromises);

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
        images: [savedPhone.phone_img, ...phoneImages],
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
    const listOfProducts = await Phone.aggregate([
      {
        $lookup: {
          from: "specs", // Collection name for Specs
          localField: "_id",
          foreignField: "phoneId",
          as: "specs",
        },
      },
      {
        $lookup: {
          from: "phone_imgs", // Collection name for PhoneImg
          localField: "_id",
          foreignField: "phoneId",
          as: "images",
        },
      }
    ]);
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
}


const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      phone_brand,
      phone_name,
      phone_img,
      ram,
      storage,
      originalprice,
      saleprice,
      stock,
      color,
      specs,
      additionalImages = []
    } = req.body;

    // Find the phone by ID
    const phone = await Phone.findById(id);
    if (!phone) {
      return res.status(404).json({
        success: false,
        message: "Phone not found",
      });
    }

    // Update the Phone document
    phone.phone_brand = phone_brand || phone.phone_brand;
    phone.phone_name = phone_name || phone.phone_name;
    phone.phone_img = phone_img || phone.phone_img;
    phone.ram = ram || phone.ram;
    phone.storage = storage || phone.storage;
    phone.originalprice = originalprice || phone.originalprice;
    phone.saleprice = saleprice || phone.saleprice;
    phone.stock = stock || phone.stock;
    phone.color = color || phone.color;

    const updatedPhone = await phone.save();

    // Update or create the Specs document
    let specsDoc = await Specs.findOne({ phoneId: updatedPhone._id });
    if (!specsDoc) {
      specsDoc = new Specs({ phoneId: updatedPhone._id });
    }

    specsDoc.display_type = specs.display_type || specsDoc.display_type;
    specsDoc.processor = specs.processor || specsDoc.processor;
    specsDoc.antutuscore = specs.antutuscore || specsDoc.antutuscore;
    specsDoc.camera_sensor = specs.camera_sensor || specsDoc.camera_sensor;
    specsDoc.camera_mp = specs.camera_mp || specsDoc.camera_mp;
    specsDoc.battery_cap = specs.battery_cap || specsDoc.battery_cap;
    specsDoc.refresh_rate = specs.refresh_rate || specsDoc.refresh_rate;
    specsDoc.speaker = specs.speaker || specsDoc.speaker;

    const updatedSpecs = await specsDoc.save();

    // Remove existing PhoneImg documents for this phone
    await PhoneImg.deleteMany({ phoneId: updatedPhone._id });

    // Add new PhoneImg documents for each additional image
    if (additionalImages.length > 0) {
      const phoneImages = additionalImages.map((img) => ({
        phoneId: updatedPhone._id,
        color: color, // Assuming color is the same for each additional image, modify as needed
        img: img,
      }));
      await PhoneImg.insertMany(phoneImages);
    }
    console.log("edit : ", updatedPhone)
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: {
        phone: updatedPhone,
        specs: updatedSpecs,
        images: additionalImages,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred while updating the product",
    });
  }
};

// const editProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const 
//     // const {

//     //   images, // Array of image URLs
//     //   brand, mobilename, // Phone details
//     //   display, processor, antutu, sensor, mp, battery, rr, speaker, // Phone specs
//     //   ram, storage, color, price, saleprice, totalStock // Phone category details
//     // } = req.body;

//     // console.log("images : ",images)
//     // console.log("brand : ",brand)
//     // console.log("name : ",mobilename)
//     // console.log("name : ",display)
//     // console.log("name : ",processor)
//     // console.log("name : ",antutu)
//     // console.log("name : ",sensor)
//     // console.log("name : ",mp)
//     // console.log("name : ",battery)
//     // console.log("name : ",rr)
//     // console.log("name : ",speaker)
//     // console.log("name : ",ram)
//     // console.log("name : ",storage)
//     // console.log("name : ",color)
//     // console.log("name : ",price)
//     // console.log("name : ",saleprice)
//     // console.log("name : ",totalStock)
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
//     phone.phone_img = images[0] || phone.phone_img;
//     phone.ram = ram || phone.ram;
//     phone.storage = storage || phone.storage;
//     phone.originalprice = price || phone.originalprice;
//     phone.saleprice = saleprice || phone.saleprice;
//     phone.stock = totalStock || phone.stock;
//     phone.color = color || phone.color;


//     const updatedPhone = await phone.save(); // Save the updated phone

//     // Find or create the PhoneCat document

//     // Remove existing PhoneImg documents

//     // Find or create the Specs document
//     const specs = await Specs.findOne({ phoneId: phone._id });
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
    console.error(e); // Changed from console.log to console.error for better error logging
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
  editProduct,
  deleteProduct,
};