const user = require('../models/user')
const usermodel=require('../models/user')

exports.addtowishlist=async(req,res)=>{
    const productId=req.params.id
    const userId=req.body.userId
    try{
        let user=await usermodel.findOne({_id:userId})
        if (!user) {
            return res.status(404).json({ message: "Error Adding Item To Cart" });
        }
        else{
            if (!user.wishlist.includes(productId)) {
                user.wishlist.push(productId);
            } else {
                return res.status(200).json({ message: "Product already in wishlist" });
            }
        }
        await user.save();
        res.status(200).json({ message: "Product added to wishlist" });

    }
    catch (error) {
        res.status(500).json({ message: "Failed to add product to wishlist", error });
    }
}

exports.getwishlist=async(req,res)=>{
    const userId=req.params.id;
    try{
        let user = await usermodel.findOne({_id: userId}).populate('wishlist')
        if(!user){
            return res.status(400).json({ message: "there is some problem" })
        }
        else{
            return res.status(200).json({wishlist:user.wishlist})
        }
    }
    catch(error){
        return res.status(400).json({"message":"Error fetching Cart"})
    }
}