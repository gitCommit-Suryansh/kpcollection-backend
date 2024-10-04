const express=require('express')
const router=express.Router()
const Ownercontroller=require('../controllers/Owner')
const upload=require('../config/multer-config')


router
   .post('/createproduct',upload.array('images', 10),Ownercontroller.createproduct)


module.exports=router