// const mongoose = require("mongoose");

// // Define schemas and models for Phone and Specs collections
// const Phone = mongoose.model(
//     "Phone",
//     new mongoose.Schema({
//         phone_brand: String,
//         phone_name: String,
//         phone_img: String,
//         ram: Number,
//         storage: Number,
//         originalprice: Number,
//         saleprice: Number,
//         stock: Number,
//         color: String,
//     })
// );

// const Specs = mongoose.model(
//     "Specs",
//     new mongoose.Schema({
//         phoneId: { type: mongoose.Schema.Types.ObjectId, ref: "Phone", required: true },
//         display_type: String,
//         processor: String,
//         antutuscore: Number,
//         camera_sensor: String,
//         camera_mp: Number,
//         battery_cap: Number,
//         refresh_rate: Number,
//         speaker: String,
//     })
// );

// // Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/myfirst", { useNewUrlParser: true, useUnifiedTopology: true });

// async function insertData() {
//     try {
//         // Phone data
//         const phones = [
//             {
//                 phone_brand: "Apple",
//                 phone_name: "iPhone 13 Pro Max",
//                 phone_img: "https://example.com/iphone13pro.jpg",
//                 ram: 6,
//                 storage: 128,
//                 originalprice: 1099,
//                 saleprice: 999,
//                 stock: 50,
//                 color: "Silver",
//             },
//             {
//                 phone_brand: "Samsung",
//                 phone_name: "Galaxy S21 Ultra",
//                 phone_img: "https://example.com/galaxys21ultra.jpg",
//                 ram: 12,
//                 storage: 256,
//                 originalprice: 1199,
//                 saleprice: 1099,
//                 stock: 30,
//                 color: "Phantom Black",
//             },
//             {
//                 phone_brand: "OnePlus",
//                 phone_name: "OnePlus 9 Pro",
//                 phone_img: "https://example.com/oneplus9pro.jpg",
//                 ram: 8,
//                 storage: 128,
//                 originalprice: 969,
//                 saleprice: 869,
//                 stock: 40,
//                 color: "Morning Mist",
//             },
//             {
//                 phone_brand: "Xiaomi",
//                 phone_name: "Mi 11 Ultra",
//                 phone_img: "https://example.com/mi11ultra.jpg",
//                 ram: 12,
//                 storage: 256,
//                 originalprice: 849,
//                 saleprice: 799,
//                 stock: 20,
//                 color: "Ceramic White",
//             },
//             {
//                 phone_brand: "Google",
//                 phone_name: "Pixel 6 Pro",
//                 phone_img: "https://example.com/pixel6pro.jpg",
//                 ram: 12,
//                 storage: 128,
//                 originalprice: 899,
//                 saleprice: 849,
//                 stock: 25,
//                 color: "Cloudy White",
//             },
//             // Add 10 more entries
//             {
//                 phone_brand: "Apple",
//                 phone_name: "iPhone 12",
//                 phone_img: "https://example.com/iphone12.jpg",
//                 ram: 4,
//                 storage: 64,
//                 originalprice: 799,
//                 saleprice: 699,
//                 stock: 70,
//                 color: "Black",
//             },
//             {
//                 phone_brand: "Samsung",
//                 phone_name: "Galaxy A52",
//                 phone_img: "https://example.com/galaxya52.jpg",
//                 ram: 6,
//                 storage: 128,
//                 originalprice: 499,
//                 saleprice: 449,
//                 stock: 60,
//                 color: "Awesome Blue",
//             },
//             {
//                 phone_brand: "OnePlus",
//                 phone_name: "OnePlus 8T",
//                 phone_img: "https://example.com/oneplus8t.jpg",
//                 ram: 12,
//                 storage: 256,
//                 originalprice: 749,
//                 saleprice: 649,
//                 stock: 35,
//                 color: "Aquamarine Green",
//             },
//             {
//                 phone_brand: "Xiaomi",
//                 phone_name: "Redmi Note 10 Pro",
//                 phone_img: "https://example.com/redminote10pro.jpg",
//                 ram: 6,
//                 storage: 128,
//                 originalprice: 299,
//                 saleprice: 279,
//                 stock: 80,
//                 color: "Onyx Gray",
//             },
//             {
//                 phone_brand: "Google",
//                 phone_name: "Pixel 5",
//                 phone_img: "https://example.com/pixel5.jpg",
//                 ram: 8,
//                 storage: 128,
//                 originalprice: 699,
//                 saleprice: 649,
//                 stock: 45,
//                 color: "Just Black",
//             },
//             {
//                 phone_brand: "Realme",
//                 phone_name: "Realme 8 Pro",
//                 phone_img: "https://example.com/realme8pro.jpg",
//                 ram: 8,
//                 storage: 128,
//                 originalprice: 279,
//                 saleprice: 249,
//                 stock: 100,
//                 color: "Infinite Blue",
//             },
//             {
//                 phone_brand: "Oppo",
//                 phone_name: "Oppo Reno5 Pro",
//                 phone_img: "https://example.com/renopro.jpg",
//                 ram: 8,
//                 storage: 128,
//                 originalprice: 399,
//                 saleprice: 349,
//                 stock: 50,
//                 color: "Astral Blue",
//             },
//             {
//                 phone_brand: "Vivo",
//                 phone_name: "Vivo X60",
//                 phone_img: "https://example.com/vivox60.jpg",
//                 ram: 12,
//                 storage: 256,
//                 originalprice: 599,
//                 saleprice: 549,
//                 stock: 55,
//                 color: "Shimmer Blue",
//             },
//             {
//                 phone_brand: "Sony",
//                 phone_name: "Sony Xperia 1 III",
//                 phone_img: "https://example.com/xperia1.jpg",
//                 ram: 12,
//                 storage: 256,
//                 originalprice: 1199,
//                 saleprice: 1099,
//                 stock: 25,
//                 color: "Frosted Black",
//             }
//         ];

//         // Insert phones into the Phone collection
//         const insertedPhones = await Phone.insertMany(phones);
//         console.log("Inserted phones:", insertedPhones);

//         // Specs data using phone ObjectId
//         const specs = insertedPhones.map((phone) => ({
//             phoneId: phone._id,
//             display_type: "AMOLED",
//             processor: "Snapdragon 888",
//             antutuscore: 750000,
//             camera_sensor: "Sony IMX789",
//             camera_mp: 48,
//             battery_cap: 4500,
//             refresh_rate: 120,
//             speaker: "Stereo Speakers",
//         }));

//         // Insert specs into the Specs collection
//         await Specs.insertMany(specs);
//         console.log("Inserted specs");

//     } catch (error) {
//         console.error("Error inserting data:", error);
//     } finally {
//         mongoose.connection.close();
//     }
// }

// insertData();
