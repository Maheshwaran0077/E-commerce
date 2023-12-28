const asyncErrorHandle = require("../middleWare/asyncErrorHandle")
const ErrorHandler = require("../utile/errorHandle/errorHandle")
const sendToken = require("../utile/jwt")
const User = require("../modules/userModule")
const sendEmail = require("../utile/email")
const crypto = require("crypto")
  

exports.user = asyncErrorHandle(async (req, res, next) => {
    const { name, email, password } = req.body;
    let avatar; 
    if(req.file){
        avatar=`${process.env.BACKGROUND_URL}/uploads/user/${req.file.originalname}`
    }
    const userCreate = await User.create({
        name,
        email, 
        password,
        avatar
    })
    sendToken(userCreate, 201, res)


})

exports.loginUser = asyncErrorHandle(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    //finding the user database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    if (!await user.isValidPassword(password)) {
        return next(new ErrorHandler('Invalid email or password', 401))
    }

    sendToken(user, 201, res)

}),
    exports.logOut = (req, res, next) => {
        res.cookie('token', null, { 
            expires: new Date(Date.now()),
            httpOnly: true
        })
            .status(200)
            .json({
                success: true,
                message: "Loggedout"
            })

    }


// exports.forgotPassword = asyncErrorHandle(async (req, res, next) => {

//     const user = await User.findOne({ email: req.body.email })

//     if (!user) {
//         return next(new ErrorHandler("invalid email . User Email is not found"), 401);

//     }
//     const resetToken = user.getResetToken();
//     await user.save({ validateBeforeSave: false })

//     const createUrl = `{req.protocol}://{req.get('host')}/api/v1/password/reset/${resetToken}`
//     //req.protocol means fetch server protocol
//     const message = `your password url link followd \n
// ${createUrl} \n\n if you are not requested this mail ignore it`

//     try {
//         sendToken({
//             email: user.email,
//             subject: "shoppingApp clone PASSWORD RECOVERY !!!",
//             message
//         })
//         res.status(200).json({
//             success: true,
//             message: `email successfully sended to ${user.email}`
//         })


//     } catch (error) {
//         user.resetPasswordToken = undefined;
//         user.resetPasswordTokenExpire = undefined;
//         await user.save({ validateBeforeSave: false });
//         return next(new ErrorHandler(error.message), 500)



//     }






//     //Create reset url

//     // const resetToken =await user.getResetToken();
//     // await user.save({validateBeforeSave: false})

//     // const resetUrl = `${req.protocol}/password/reset/${resetToken}`;

//     // const message = `Your password reset url is as follows \n\n 
//     // ${resetUrl} \n\n If you have not requested this email, then ignore it.`;

//     // try{
//     //     sendEmail({
//     //         email: user.email,
//     //         subject: "JVLcart Password Recovery",
//     //         message
//     //     })

//     //     res.status(200).json({
//     //         success: true,
//     //         message: `Email sent to ${user.email}`
//     //     })

//     // }catch(error){
//     //     user.resetPasswordToken = undefined;
//     //     user.resetPasswordTokenExpire = undefined;
//     //     await user.save({validateBeforeSave: false});
//     //     return next(new ErrorHandler(error.message), 500)
//     // }


// })


exports.forgotPassword = asyncErrorHandle(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorHandler("user not found invalid email ", 404))
    }

    const resetToken = await user.getResetToken();
    await user.save({ validateBeforeSave: false });

    const reseturl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`
    const message = `   your password reset token url \n\n 
  ${reseturl}\n\n
  if your not requested this email kindly ignore it.`


    // try {
    //     sendEmail({
    //         email: user.email,
    //         subject: " clone password recovery",
    //         message
    //     })
    //     res.status(200).json({
    //         success: true,
    //         message: user.email
    //     })

    // } catch (error) {
    //     user.resetPasswordToken = undefined;
    //     user.resetPasswordTokenExpire = undefined;
    //     await user.save({ validateBeforeSave: false })

    //     return next(new ErrorHandler(error.message), 500)
    // } 
    try{
        sendEmail({
            email: user.email,
            subject: "clone password recovery",
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })

    }catch(error){ 
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message), 500)
    }


})
      



exports.resetPassword = asyncErrorHandle(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: {
            $gt: Date.now()
        }
    }) 

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or expired'));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match'));
    }

   
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({validateBeforeSave: false})
    sendToken(user, 201, res)

})

// userProfile

exports.getUserProfile = asyncErrorHandle(async (req, res, next) => {

    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })
})

// user pasword change
exports.changePassword = asyncErrorHandle(async (req, res, next) => {
     const user = await User.findById(req.user.id).select('+password');
     if(!await user.isValidPassword(req.body.oldPassword)) {
        return next(new ErrorHandler('Old password is incorrect', 401));
    }
    user.password = req.body.password
    await user.save()
    res.status(200).json({
        success: true,
        user

    })

})

//update user

exports.updateProfile = asyncErrorHandle(async (req, res, next) => {
    let newUserData = {
        name: req.body.name,
        email: req.body.email,
    }
    let avatar;
    if(req.file){
        avatar=`${process.env.BACKGROUND_URL}/uploads/user/${req.file.originalname}`
        newUserData={...newUserData,avatar}
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    })
    res.status(201).json({
        sucess: true,
        user 
    })
})

//ADMIN: getAll users
exports.getAllusers = asyncErrorHandle(async (req, res, next) => {
    const user = await User.find()

    res.status(201).json({
        success: true,
        user
    }) 
}) 
//ADMIN: get specific user
exports.getSpecificUser=asyncErrorHandle(async(req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user){
        return (next(new ErrorHandler("user not found this id"),404))
    }
    res.status(201).json({
        success:true, 
        user  
    }) 
})  
//ADMIN: update userProfile
exports.updateUserProfile=asyncErrorHandle(async(req,res,next)=>{
    const updateUser={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    const user=await User.findByIdAndUpdate(req.params.id,updateUser,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        user
    })
})
//ADMIN: delete user
exports.deleteUser=asyncErrorHandle(async(req,res,next)=>{
    const user=await User.findById(req.params.id)
    if(!user){
        return (next(new ErrorHandler("user not found"),404))
    }
    await user.remove()
    
    res.status(200).json({
        success:true
    })
})