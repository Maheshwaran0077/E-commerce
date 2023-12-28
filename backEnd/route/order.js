const express=require("express")
const { createOrder, 
    getSingleOrders, 
    myOrders, 
    allOrders, 
    getSpecificOrder, 
    deleteOrder, 
    updateOrder, 
    createReview,
    getReviews,
    deleteReviews} = require("../controller/orderController")
const { authenctiate, authorizedPerson } = require("../middleWare/authenticate")
 const router=express.Router()  

router.route('/order/new').post(authenctiate,createOrder)
router.route('/myorders').get(authenctiate,myOrders); 
router.route("/orders/:id").get(authenctiate,getSingleOrders)
                           .delete(authenctiate,deleteOrder)
// router.route('/order/:id').get(authenctiate,getSpecificOrder); 

//ADMINE 


//REVIEWS
router.route('/review').put(authenctiate,createReview);  
router.route('/review').delete(authenctiate,deleteReviews);  

router.route('/reviews').get(getReviews);  



// ADMIN ACCESS
router.route('/admin/allOrder').get(authenctiate,authorizedPerson("admin"),allOrders); 
//ADMIN SPECIFIC ORDER
router.route('/admin/specificOrder/:id').get(authenctiate,authorizedPerson("admin"),getSpecificOrder); 
//ADMIN DELETE ORDER
router.route('/admin/deleteOrder/:id').delete(authenctiate,authorizedPerson("admin"),deleteOrder);
//ADMIN UPDATE ORDER
router.route('/admin/updateOrder/:id').put(authenctiate,authorizedPerson("admin"),updateOrder); 





module.exports=router  