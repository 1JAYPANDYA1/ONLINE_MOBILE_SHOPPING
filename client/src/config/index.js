export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "Apple", label: "Apple" },
      { id: "Samsung", label: "Samsung" },
      { id: "OnePlus", label: "OnePlus" },
      { id: "Vivo", label: "Vivo" },
      { id: "Oppo", label: "Oppo" },
      { id: "Realme", label: "Realme" },
    ],
  },
  {
    label: "Mobile Name",
    name: "mobilename",
    componentType: "input",
    type: "text",
    placeholder: "Enter Mobile Name",
  },
  {
    label: "Display Type",
    name: "display",
    componentType: "input",
    type: "text",
    placeholder: "Enter Display Type",
  },
  {
    label: "Processor Name",
    name: "processor",
    componentType: "input",
    type: "text",
    placeholder: "Enter Processor Name",
  },
  {
    label: "Antutu Score",
    name: "antutu",
    componentType: "input",
    type: "text",
    placeholder: "Enter Antutu Score",
  },
  {
    label: "Camera Sensor",
    name: "sensor",
    componentType: "input",
    type: "text",
    placeholder: "Enter Camera Sensor",
  },
  {
    label: "Camera MegaPixel",
    name: "mp",
    componentType: "input",
    type: "text",
    placeholder: "Enter Camera MegaPixel",
  },
  {
    label: "Battery Capacity",
    name: "battery",
    componentType: "input",
    type: "text",
    placeholder: "Enter Battery Capacity",
  },
  {
    label: "Refresh Rate",
    name: "rr",
    componentType: "input",
    type: "text",
    placeholder: "Enter Refresh Rate",
  },
  {
    label: "Speaker",
    name: "speaker",
    componentType: "select",
    options: [
      { id: "mono", label: "Mono" },
      { id: "stereo", label: "Stereo" },
      ],
  },
  {
    label: "RAM",
    name: "ram",
    componentType: "input",
    type: "text",
    placeholder: "Enter RAM",
  },
  {
    label: "Storage",
    name: "storage",
    componentType: "input",
    type: "text",
    placeholder: "Enter Storage",
  },
  {
    label: "Color",
    name: "color",
    componentType: "input",
    type: "text",
    placeholder: "Enter Color",
  },
  {
    label: "Original Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter Phone Original price",
  },
  {
    label: "Sale Price",
    name: "saleprice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Phones",
    path: "/shop/listing",
  },
  {
    id: "men",
    label: "About",
    path: "/shop/listing",
  },
  {
    id: "women",
    label: "Contact",
    path: "/shop/listing",
  },
  {
    id: "kids",
    label: "Help",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  accessories: "Accessories",
  footwear: "Footwear",
};

export const brandOptionsMap = {
  apple: "Apple",
  samsung: "Samsung",
  oneplus: "OnePlus",
  vivo: "Vivo",
  oppo: "Oppo",
  realme: "Realme"
};

export const filterOptions = {
  phone_brand: [
    { id: "Apple", label: "Apple" },
    { id: "Samsung", label: "Samsung" },
    { id: "OnePlus", label: "OnePlus" },
    { id: "Vivo", label: "Vivo" },
    { id: "Oppo", label: "Oppo" },
    { id: "Realme", label: "Realme" },
    // Add more brands as needed
  ],
  color: [
    { id: "Black", label: "Black" },
    { id: "White", label: "White" },
    { id: "Blue", label: "Blue" },
    { id: "Green", label: "Green" },
    { id: "Purple", label: "Purple" },
    { id: "Pink", label: "Pink" },
    // Add more colors as needed
  ],
  // Add more filter categories if needed
};

export const sortOptions = [
  { id: "saleprice-lowtohigh", label: "Price: Low to High" },
  { id: "saleprice-hightolow", label: "Price: High to Low" },
  { id: "phone_name-atoz", label: "Name: A to Z" },
  { id: "phone_name-ztoa", label: "Name: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter Your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter Your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter Your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
