
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
            orderStatus: paymentDetails.code === 'PAYMENT_SUCCESS' ? 'Processing' :
                         paymentDetails.code === 'PAYMENT_PENDING' ? 'PENDING' :
                         'FAILED',
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();

        // Push the saved order's ID into the user's orders array
        await userModel.findByIdAndUpdate(userDetails.userId, {
            $push: { orders: savedOrder._id }
        });

        res.status(200).json({ message: "Order created successfully", order: savedOrder });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Failed to create order", error });
    }
}

exports.getorders = async (req, res) => {
    try {
        const user = await userModel.findOne({_id:req.params.userId}).populate({
            path: "orders",
            populate: {
                path: "productDetails.productId",
                model: "product"
            }
        });
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json({ message:"Orders fetched successfully", orders:user.orders });
    } catch (error) {
        res.status(500).json({ message: "Failed to get orders", error });
    }
}

exports.getorderbyid = async (req, res) => {
    try {
        const order = await ordermodel.findOne({_id:req.params.orderId}).populate({
            path:'productDetails.productId',
            model:"product"
        })
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        res.status(200).json({message:"Order fetched successfully",order});
    } catch (error) {
        res.status(500).json({ message: "Failed to get order", error });
    }
}

exports.allorders=async(req,res)=>{
    try{
        const orders=await ordermodel.find();
        if(orders){
            return res.status(200).json({message:"Orders fetched Successfully",orders:orders})
        }else{
            return res.status(404).json({message:"error fetching orders"})
        }

    }
    catch(error){
        res.status(500).json({message:"Failed to fetch orders",error})
    }
}

exports.updateStatus = async (req, res) => {
    const { orderId, status } = req.body;
  
    try {
      const validStatuses = ["Processing", "Shipped", "Delivered","FAILED","PENDING"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value." });
      }
      const updatedOrder = await ordermodel.findByIdAndUpdate(orderId,{ orderStatus: status },{ new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ success: false, message: "Order not found." });
      }
  
      res.status(200).json({ success: true, message: "Order status updated successfully.", order: updatedOrder });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ success: false, message: "An error occurred while updating the order status." });
    }
  };
        