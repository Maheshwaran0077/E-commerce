const express=require("express")
const router= express.Router();
const {authenctiate}=require("../middleWare/authenticate");
const { processPayment, sendStripeApi } = require("../controller/paymentController");

router.route('/payment/process').post(authenctiate,processPayment)
router.route('/stripeapi').get(authenctiate,sendStripeApi)

module.exports=router
