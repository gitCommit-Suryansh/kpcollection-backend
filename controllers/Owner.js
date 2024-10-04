const usermodel = require("../models/user");
const ownermodel = require("../models/owner");
const productmodel = require("../models/product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generatetoken");
const upload = require("../config/multer-config");


exports.createproduct=async(req,res)=>{
    try {
        const { name, description, price, discount, bgcolor, panelcolor, textcolor, owner } = req.body;
    
        // req.files will contain an array of uploaded files
        const images = req.files; // Access uploaded images
    
        // If you only want to store buffer values, you can map over images to extract buffers
        const imageBuffers = images.map(image => image.buffer); // Extract only the buffer values
    
        // Example: Save product to your database (with buffers in an array)
        const product = {
          name,
          description,
          price,
          discount,
          bgcolor,
          panelcolor,
          textcolor,
          owner,
          images: imageBuffers, // Store the array of image buffers
        };
        await productmodel.create(product)
        res.status(200).json({ message: 'Product created successfully!', product });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create product' });
      }

}