const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/myfirst", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

const PhoneImg = require("../models/PhoneImg"); // Adjust the path as necessary

const addPhoneImages = async (phoneId, images) => {
    try {
        const phoneImages = images.map(image => ({
            phoneId,
            color: image.color,
            img: image.img,
        }));

        const savedImages = await PhoneImg.insertMany(phoneImages);
        console.log("Images saved successfully:", savedImages);
    } catch (error) {
        console.error("Error saving images:", error);
    }
};

// Usage example
const run = async () => {
    await connectDB();

    const phoneId = "66e98b8dc922b29e51eae845"; // Your specific phoneId
    const images = [
        { color: "Green", img: "https://res.cloudinary.com/dgqpblsge/image/upload/v1727470741/t5pzjcyuf2jownrs1kix.jpg" },
        { color: "Green", img: "https://res.cloudinary.com/dgqpblsge/image/upload/v1727470741/eh4pjqi9nq0ha3a5xikf.jpg" },
        { color: "Green", img: "https://res.cloudinary.com/dgqpblsge/image/upload/v1727470741/ronadtnjitkgghvybi23.jpg" },
    ];

    await addPhoneImages(phoneId, images);
};

run();
