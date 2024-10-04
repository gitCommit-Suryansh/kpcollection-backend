const ordermodel = require("../models/order");
const userModel = require("../models/user");

exports.createorder = async (req, res) => {
    try {
        const { userId, username, products, totalAmount, shippingAddress, paymentMethod,paymentStatus,orderStatus } = req.body.order;
    
        
        const order = new ordermodel({
            userId,
            username,
            products,
            totalAmount,
            shippingAddress,
            paymentMethod,
            paymentStatus,
            orderStatus
        });
        

        await order.save();

        const user = await userModel.findOne({_id:userId});
        user.orders.push(order._id);
        await user.save();
        res.status(200).json({ message: "Order created successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Failed to create order", error });
    }
}

exports.getorders = async (req, res) => {
    try {
        const user = await userModel.findOne({_id:req.params.userId}).populate({path:"orders",populate:{path:"products.productId",model:"product"}});
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json({ message:"Orders fetched successfully",orders:user.orders});
    } catch (error) {
        res.status(500).json({ message: "Failed to get orders", error });
    }
}

exports.getorderbyid = async (req, res) => {
    try {
        const order = await ordermodel.findOne({_id:req.params.orderId}).populate({path:"products.productId",model:"product"});
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        res.status(200).json({message:"Order fetched successfully",order});
    } catch (error) {
        res.status(500).json({ message: "Failed to get order", error });
    }
}   
        