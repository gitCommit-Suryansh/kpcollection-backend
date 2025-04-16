const usermodel = require("../models/user");
const ownermodel = require("../models/owner");
const productmodel = require("../models/product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generatetoken");
const upload = require("../config/multer-config");


exports.createproduct = async (req, res) => {
  try {
    const { name, description, price, discount, owner, sizes, category } = req.body;
    // Cloudinary returns file info in req.files, use `path` for the image URL
    const imageUrls = req.files.map(file => file.path);

    const product = {
      name,
      description,
      price,
      discount,
      owner,
      sizes,
      category,
      images: imageUrls, // Save image URLs instead of buffers
    };

    await productmodel.create(product);
    res.status(200).json({ message: 'Product created successfully!', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create product',err });
  }
};
