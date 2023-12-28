const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const crypto = require('crypto');



const userModule = mongoose.Schema({
        name: {
            type: String,
            required: [true, "enter the name"] 
        },
        email:{
            type: String,
            required: [true, 'Please enter email'], 
            unique: true,
            validate: [validator.isEmail, 'Please enter valid email address']
        },
        password: {
            type: String,
            required: [true, "enter the password"],
            maxLength: [6, "enter the password in 6 character"],
            select: false
        },
        avatar: {
            type: String,

        },
        resetPasswordToken: String,
        resetPasswordTokenExpire: Date,
        role: {
            type: String,
            default: "user",
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    })
    //pre tage is used to handel the lot of operation 
    // userModule.pre("save", async function (next) {
    // console.log(this.password)
    // if(!this.isModified('password')){
    //     next()
    // }
    //     this.password  = await bcrypt.hash(this.password, 10)


    // })
    userModule.pre('save',async function (next){
        if(!this.isModified('password')){ 
            next();
        }
        this.password  = await bcrypt.hash(this.password, 10)
    }) 

    userModule.methods.getToken = function () {
        return jwt.sign({ id: this.id }, process.env.JWT_PRIVATE_KEY, {
            expiresIn: process.env.JWT_EXPIRE_TIME,
        })   
    }

    userModule.methods.isValidPassword = async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password)
    }

    userModule.methods.getResetToken=async function(){ 
        //generate token
        const token = crypto.randomBytes(20).toString('hex');
        //genereate token hash and send to resetpassword filed
        this.resetPasswordToken =  crypto.createHash('sha256').update(token).digest('hex');
        //set expire time for resetpassword

        this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;


    return token
    }

    userModule.methods.getResetToken=async ()=>{ 

        const token=crypto.randomBytes(16).toString('hex');

      this.resetPasswordToken= crypto.createHash('sha256').update(token).digest('hex')

      this.resetPasswordTokenExpire=`${Date.now() + 30 * 60* 1000}`;

      return token


    }

//     name: {
//         type: String,
//         required: [true, 'Please enter name']
//     },
//     email: {
//         type: String,
//         required: [true, 'Please enter email'],
//         unique: true,
//         validate: [validator.isEmail, 'Please enter valid email address']
//     },
//     password: {
//         type: String,
//         required: [true, 'Please enter password'],
//         maxlength: [6, 'Password cannot exceed 6 characters'],
//         select: false
//     },
//     avatar: {
//         type: String
//     },
//     role: {
//         type: String,
//         default: 'user'
//     },
//     resetPasswordToken: String,
//     resetPasswordTokenExpire: Date,
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// })

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         next();
//     }
//     this.password = await bcrypt.hash(this.password, 10)
// })

// userSchema.methods.getJwtToken = function () {
//     return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_TIME
//     })
// }

// userSchema.methods.isValidPassword = async function (enteredPassword) {
//     return bcrypt.compare(enteredPassword, this.password)
// }

// userSchema.methods.getResetToken = function () {
//     //Generate Token
//     const token = crypto.randomBytes(20).toString('hex');

//     //Generate Hash and set to resetPasswordToken
//     this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

//     //Set token expire time
//     this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

//     return token
// }

let model = mongoose.model('user', userModule);


module.exports = model;
