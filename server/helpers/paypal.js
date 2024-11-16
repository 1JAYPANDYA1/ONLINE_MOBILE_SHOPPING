const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AbY34bXL-cJjR-6LwCDJn7Gf2B0cf-yVRv_hNj1ZRI_Yl4wcr4pyO7D3XesAcHNo0ZaHx8Q-UNwkR-Sg",
  client_secret: "EA5Dr4ArQ2Ll4m02HBVTms5GCUH23quKTKQvwzSqSOJUF7z3kwBefmFVk9f7LT8M9maXsptBgvCozeF6",
});

module.exports = paypal;
