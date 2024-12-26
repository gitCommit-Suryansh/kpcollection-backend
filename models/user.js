const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:Number,
        required:true
    },
    
    cart:[
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true
            },
            size: {
                type: String,
                required: true
            },
            quantity:{
                type:Number,
                default:1,
                required:true
            }
        }
    ],
    
    orders:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Order",
            default:[]  
        }
    ],
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String
    },
    profile:{
        type:Buffer,
        
    }
})

module.exports=mongoose.model('user',userSchema)