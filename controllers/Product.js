
const productmodel = require("../models/product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generatetoken");
const upload = require("../config/multer-config");

exports.allproducts=async(req,res)=>{
    try {
        const products=await productmodel.find().populate("owner")
        res.status(200).json({message:"Products fetched successfully",products})
    } catch (error) {
        res.status(500).json({message:"Failed to fetch products"})
    }
}

exports.productdets = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productmodel.findOne({_id:productId}).populate("owner");
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.status(200).json({ message: "Product details fetched successfully", product });
    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({ message: "Failed to fetch product details" });
    }

}