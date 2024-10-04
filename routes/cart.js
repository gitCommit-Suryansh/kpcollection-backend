const express=require('express')
const router=express.Router()
const cartcontroller=require('../controllers/Cart')

router
    .post('/addtocart/:id',cartcontroller.addtocart)
    .get('/getcart/:id',cartcontroller.getcart)
    .post('/removefromcart/:id',cartcontroller.removefromcart)
    
module.exports=router