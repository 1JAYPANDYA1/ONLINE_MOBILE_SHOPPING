const Phone = require("../../models/Phone");

// Function to insert data into the database
const addentry = async (req, res) => {
    try {
        // Create a new phone entry using data from req.body
        const newPhone = new Phone({
            phone_brand:"apple",
            phone_name: "iphone",
            phone_img: "img"        });

        // Save the phone entry to the database
        const savedPhone = await newPhone.save();

        // Respond with the saved entry
        res.status(201).json(savedPhone);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: "Failed to add entry", error });
    }
};

// Function to retrieve all phone entries from the database
const getentry = async (req, res) => {
    try {
        // Retrieve all phone entries
        const phones = await Phone.find();

        // Respond with the list of phones
        res.status(200).json(phones);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: "Failed to retrieve entries", error });
    }
};

module.exports = { addentry, getentry };
