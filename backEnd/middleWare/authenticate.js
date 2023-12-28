const asyncErrorHandle=require("../middleWare/asyncErrorHandle");
const ErrorHandle = require("../utile/errorHandle/errorHandle");
const User=require("../modules/userModule")
const jwt=require("jsonwebtoken")
const crypto=require("crypto")


exports.authenctiate= asyncErrorHandle( async(req,res,next)=>{

    const {token}=req.cookies;
   // we only token so we use destructure{token}

   if(!token){
    return next(new ErrorHandle("login first to access this resource"),404)
   }
   const decode=jwt.verify(token,process.env.JWT_PRIVATE_KEY);
 req.user=await User.findById(decode.id)

   next()

}) 

exports.authorizedPerson=(...roles)=>{ 
   return (req,res,next)=>{
 if(!roles.includes(req.user.role)){
    return next( new ErrorHandle(`this ${req.user.role} is not allow to access`,401) )
 }
 next();
    }
  
}


 