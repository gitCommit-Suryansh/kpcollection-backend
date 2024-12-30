const express=require('express')
const router=express.Router()
const wishlistcontroller=require('../controllers/Wishlist')

router
   .post('/addtowishlist/:id',wishlistcontroller.addtowishlist)
   .get('/getwishlist/:id',wishlistcontroller.getwishlist)
    
module.exports=router