const express = require("express");
const multer = require("multer")
const path = require("path")

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {

            cb(null, path.join(__dirname, "..", 'uploads/user'))
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
})
const { user,
    loginUser,
    logOut,
    forgotPassword,
    resetPassword,
    getUserProfile,
    changePassword,
    updateUserProfile,
    getAllusers,
    getSpecificUser,
    deleteUser,
    updateProfile
} = require("../controller/userController");
// const { logOut } = require("../middleWare/authenticate");

const router = express.Router();

const { authenctiate, authorizedPerson } = require("../middleWare/authenticate")


// register user  
router.route("/register").post(upload.single('avatar'), user)
// login user
router.route("/login").post(loginUser)
// logout password 
router.route("/logout").get(logOut)
//forgot password
router.route("/password/forgot").post(forgotPassword)
//user reset password  
router.route("/password/reset/:token").post(resetPassword) 
//user profile 
router.route("/userProfile").get(authenctiate, getUserProfile)
//user change password
router.route("/password/change").put(authenctiate, changePassword)
//update userprofile
// router.route("/userProfile/update").put(authenctiate, updateUserProfile)
router.route('/update').put(authenctiate,upload.single('avatar'), updateProfile);


//ADMIN operation  

// getAll users
router.route("/admin/getAll").get(authenctiate, authorizedPerson("admin"), getAllusers)
// get specific user
router.route("/admin/user/:id").get(authenctiate, authorizedPerson("admin"), getSpecificUser)
    // change the role
    .put(authenctiate, authorizedPerson("admin"), updateUserProfile)
    //delete user
    .delete(authenctiate, authorizedPerson("admin"), deleteUser)











module.exports = router;   