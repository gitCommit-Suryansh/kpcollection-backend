const express=require('express')
const router=express.Router()
const productcontroller=require('../controllers/Product')

router
    .get('/allproducts',productcontroller.allproducts)
    .get('/product/:id', productcontroller.productdets)

    
module.exports=router