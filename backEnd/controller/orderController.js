const Order = require("../modules/order")
const asyncErrorHandle = require("../middleWare/asyncErrorHandle")
const ErrorHandler = require("../utile/errorHandle/errorHandle");
const order = require("../modules/order");
const Product = require("../modules/productModule");
exports.createOrder = asyncErrorHandle(async (req, res, next) => {
    const {
        // shippingInfo,
        // orderItems,
        // taxPrice,  
        // shippingPrice, 
        // totalPrice,
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = req.body;
    const order = await Order.create({
        // shippingInfo,
        // orderItems,
        // taxPrice,
        // shippingPrice,
        // totalPrice,
        // createdAt:Date.now(),
        // user:req.user.id    
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    })
    res.status(200).json({
        success: true,
        order
    })
})

//get single order

// exports.getSingleOrder=asyncErrorHandle(async(req,res,next)=>{
//     const order=await Order.findById(req.params.id).populate("user","name email")

//     if(!order) return next(new ErrorHandler("order not found this"+`${req.params.id}`),404)

//     res.status(200).json({
//         success:true,
//         order
//     })
// })
exports.getSingleOrders = asyncErrorHandle(async (req, res, next) => {
    // const order = await Order.findById(req.params.id).populate('user', 'name email');
    const order = await Order.findById(req.params.id)


    // const order = await Order.findById(req.params.id).populate('user', 'name email')
    // model.findOne({}, undefined, { populate: {path: 'fooo', options: {strictPopulate: false}}, option: {strictPopulate: false}, })
    if (!order) return next(new ErrorHandler("invalid. order not found", 404))

    res.status(201).json({
        success: true,
        order
    })
})

exports.myOrders = asyncErrorHandle(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        orders
    })
})

//ADMIN get all orders

exports.allOrders = asyncErrorHandle(async (req, res, next) => {
    const orders = await Order.find()
    let totalAmount = 0
    orders.forEach(order => {
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//ADMIN get specific orders
exports.getSpecificOrder = asyncErrorHandle(async (req, res, next) => {
    const orders = await Order.findById(req.params.id)
    if (!orders) return next(new ErrorHandler("invalid. order not found", 404))

    res.status(201).json({
        success: true,
        orders
    })
})
//ADMIN delete order
exports.deleteOrder = asyncErrorHandle(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (!order) return next(new ErrorHandler("invalid. order not found this id", 404))

    await order.remove()

    res.status(200).json({
        success: true
    })
})
//ADMIN update order
exports.updateOrder = asyncErrorHandle(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (order.orderStatus == "Delivered") {
        return next(new ErrorHandler("you are producted is already delivered", 404))
    }
    order.orderItems.forEach(async orderItem => {
        await quantity(orderItem.product, orderItem.quantity)
    })

    order.orderStatus = req.body.orderStatus
    order.deliveredAt = Date.now();
    await order.save()
    res.status(200).json({
        success: true,
        order
    })
})
async function quantity(productId, quantity) {
    const product = await Product.findById(productId)
    product.stock = product.stock - quantity

    await product.save({ validateBeforeSave: false })


}

//CREATE REVIEWS



exports.createReview = asyncErrorHandle(async (req, res, next) =>{
    const  { productId, rating, comment } = req.body;

    const review = {
        user : req.user.id, 
        rating,
        comment,
        productId
    }

    const product = await Product.findById(productId);
   //finding user review exists
    const isReviewed = product.reviews.find(review => {
       return review.user.toString() == req.user.id.toString()
    })

    if(isReviewed){
        //updating the  review
        product.reviews.forEach(review => {
            if(review.user.toString() == req.user.id.toString()){
                review.comment = comment
                review.rating = rating
            }

        }) 

    }else{
        //creating the review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    //find the average of the product reviews
    product.ratings = product.reviews.reduce((acc, review) => {
        return review.rating + acc; 
    }, 0) / product.reviews.length;
    product.ratings = isNaN(product.ratings)?0:product.ratings;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true
    })


})
//get product reviews

exports.getReviews = asyncErrorHandle(async (req, res, next) =>{
    const product = await Product.findById(req.query.id).populate('reviews.user','name email');

    res.status(200).json({
        success: true,
        reviews: product.reviews       
    })    
})

//delete review                       
exports.deleteReviews=asyncErrorHandle(async(req,res,next)=>{
    const product =await Product.findById(req.query.productId);  
    const reviews=product.reviews.filter(review=>{
        return review._id.toString() !== req.query.id.toString()
    })
    const numOfReviews=product.reviews.length;

    ratings = reviews.reduce((acc, review) => {
        return review.rating + acc; 
    }, 0) / product.reviews.length;
    ratings = isNaN(ratings)?0:ratings;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        numOfReviews,
        ratings
    })
    res.status(200).json({
        success:true,
 
    })


})