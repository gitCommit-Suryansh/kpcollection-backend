const usermodel = require("../models/user");
const ownermodel = require("../models/owner");
const productmodel = require("../models/product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generatetoken");
const upload = require("../config/multer-config");


exports.addtocart = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.body.userId;
        const selectedSize = req.body.selectedSize;
        const quantity = req.body.quantity || 1; // Default quantity to 1 if not provided
        const user = await usermodel.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: "Error Adding Item To Cart" });
        }

        const existingItemIndex = user.cart.findIndex(item => 
            item.productId.toString() === productId && item.size === selectedSize
        );

        if (existingItemIndex > -1) {
            // If the item already exists, update the quantity
            user.cart[existingItemIndex].quantity += quantity;
        } else {
            // If the item does not exist, add it to the cart
            user.cart.push({ productId, size: selectedSize, quantity });
        }

        await user.save();
        res.status(200).json({ message: "Product added to cart" });
    } catch (error) {
        res.status(500).json({ message: "Failed to add product to cart", error });
    }
}

exports.getcart=async(req,res)=>{
    try {
        const userId = req.params.id;
        const user = await usermodel.findOne({ _id: userId }).populate({
            path: 'cart.productId',
            model: 'product'
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const cartWithDetails = user.cart.map(item => ({
            product: item.productId,
            size: item.size,
            quantity:item.quantity
        }));

        res.status(200).json({ user: { ...user.toObject(), cart: cartWithDetails } });
    } catch (error) {
        res.status(500).json({ message: "Failed to get cart", error });
    }
}

exports.removefromcart = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.body.userId;
        const user = await usermodel.findOne({ _id: userId });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.cart = user.cart.filter(item => item.productId.toString() !== productId);

        await user.save();
        res.status(200).json({ message: "Product removed from cart" });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove product from cart", error });
    }
}

