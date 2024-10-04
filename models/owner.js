const mongoose=require('mongoose')

const ownerSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:String,
    password:String,
    contact:{
        type:Number,
        required:true,
        length:10
    },
    Logo:Buffer,
    businessname:{
        type:String,
        required:true
    },
    products:{
        type:Array,
        default:[]
    },
    gstin:String
})

module.exports=mongoose.model('owner',ownerSchema)