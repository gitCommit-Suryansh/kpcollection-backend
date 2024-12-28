const ordermodel = require("../models/order");
const userModel = require("../models/user");


exports.createorder = async (req, res) => {
    try {
        const { userDetails, productDetails, paymentDetails,} = req.body;

        // Create a new order instance
        const newOrder = new ordermodel({
            userDetails: {
                userId: userDetails.userId,
                email: userDetails.email,
                name: userDetails.name,
                mobileNumber: userDetails.mobileNumber,
                iat: userDetails.iat,
                address: userDetails.address
            },
            productDetails: productDetails.map(item => ({
                productId: item.productId,
                size: item.size,
                quantity: item.quantity,
            })),
            paymentDetails: {
                success: paymentDetails.success,
                code: paymentDetails.code,
                message: paymentDetails.message,
                data: paymentDetails.data,
            },
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();

        res.status(201).json({ message: "Order created successfully", order: savedOrder });
    } catch (error) {
        console.error("Error creating order:", error);
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
        