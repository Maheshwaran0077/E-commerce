class ErrorHandle extends Error {
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ErrorHandle;




// class ErrorHandle extends Error{
//     constructor(message,statusCode){
//         super(message );
//         this.cl_statusCode=statusCode;
//         Error.captureStackTrace(this,this.constructor)

//     }
// }

// module.exports=

  