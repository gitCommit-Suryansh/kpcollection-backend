const express=require('express')
const router=express.Router()
const ordercontroller=require('../controllers/Order')

router
    .post('/createorder',ordercontroller.createorder)
    .get('/getorders/:userId',ordercontroller.getorders)
    .get('/getorderbyid/:orderId',ordercontroller.getorderbyid)
    .get('/allorders',ordercontroller.allorders)
    
    
module.exports=router