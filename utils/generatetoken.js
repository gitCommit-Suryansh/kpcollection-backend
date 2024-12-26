const jwt=require('jsonwebtoken')
require('dotenv').config();

const generateToken=(user)=>{
  return jwt.sign({id:user._id,email:user.email,name:user.name,mobileNumber:user.mobileNumber},process.env.JWT_KEY)
}

module.exports.generateToken = generateToken