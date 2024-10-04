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
    cart:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"product",
            default:[]
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