const express=require('express')
const router=express.Router()
const authcontroller=require('../controllers/Auth')
const upload=require('../config/multer-config')


router
    .post('/signup',authcontroller.signup)
    .post('/login',authcontroller.login)
    .post('/update-profile/:id',upload.single('profile'),authcontroller.updateprofile)
    .post('/ownersignup', upload.single('logo'),authcontroller.ownersignup)
    .post('/ownerlogin',authcontroller.ownerlogin)
    .get('/get-profile/:id',authcontroller.getprofile)

module.exports=router