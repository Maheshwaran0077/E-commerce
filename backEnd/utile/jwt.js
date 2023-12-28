const sendToken=(user,statusCode,res)=>{
    const token =user.getToken()

   const cookes={
    expires:new Date(Date.now()+ process.env.COOKIE_EXPIRE_TIME *24*60*60*1000),
    //                            expire in 7 days                milliseconds
    httpOnly:true,
    //must have             
   }
 
    res.status(statusCode).cookie("token",token,cookes ).json({
        //                  name of token ,gettoken,cookie fun
        success:true,
        token,
        user
    }) 

}

module.exports=sendToken;