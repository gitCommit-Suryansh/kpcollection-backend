const usermodel = require("../models/user");
const ownermodel = require("../models/owner");
const productmodel = require("../models/product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generatetoken");
const upload = require("../config/multer-config");


exports.addtocart=async(req,res)=>{
    try {
        const productId=req.params.id
        const userId=req.body.userId
        const user=await usermodel.findOne({_id:userId})
        if(!user){
            return res.status(404).json({message:"Error Adding Item To Cart"})
        }
        user.cart.push(productId)
        await user.save()
        res.status(200).json({message:"Product added to cart"})
    } catch (error) {
        res.status(500).json({message:"Failed to add product to cart",error})
    }
}

exports.getcart=async(req,res)=>{
    try {
        const userId=req.params.id
        const user=await usermodel.findOne({_id:userId}).populate("cart")
        if(!user){
            return res.status(404).json({message:"Error Adding Item To Cart"})
        }
        res.status(200).json({user})
    } catch (error) {
        res.status(500).json({message:"Failed to get cart",error})
    }
}

exports.removefromcart=async(req,res)=>{
    try {
        const productId = req.params.id;
        const userId = req.body.userId;
        const user = await usermodel.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.cart = user.cart.filter(item => item._id.toString() !== productId);
        await user.save();
        res.status(200).json({ message: "Product removed from cart" });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove product from cart", error });
    }
}

