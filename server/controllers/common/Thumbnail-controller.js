const Thumbnail = require("../../models/Thumbnail");

const addThumbnailImage = async (req, res) => {
  try {
    const image  = req.body;

    console.log(image, "image");
    const img=image.image

    const ThumbnailImages = new Thumbnail({
     image: img,
    });

    await ThumbnailImages.save();

    res.status(201).json({
      success: true,
      data: ThumbnailImages,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getThumbnailImages = async (req, res) => {
  try {
    const images = await Thumbnail.find({});

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = { addThumbnailImage, getThumbnailImages };
