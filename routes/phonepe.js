
const express=require('express')
const router=express.Router()
const paymentcontroller=require('../controllers/Phonepe')

router.post('/phonepe/pay',paymentcontroller.pay)
router.post('/phonepe/check-payment-status',paymentcontroller.checkPaymentStatus)
// router.post('/redirect-url/:merchantTransactionId',paymentcontroller.redirect)

    
module.exports=router