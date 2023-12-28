const express = require("express")
const { getProducts, newProducts, getSingleProduct, updateProduct, deleteProduct, AdminAllProduct } = require("../controller/productController")
const router = express.Router()
const { authenctiate, authorizedPerson } = require("../middleWare/authenticate")
const multer = require("multer")
const path = require("path")

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {

            cb(null, path.join(__dirname, "..", 'uploads/product'))
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
})

//getAll req -api/v1/products
router.route('/products').get(getProducts); 
//post  -api/v1/products/new
// getsingle product  
router.route("/product/:id").get(getSingleProduct)
//                              update
// .put(updateProduct)
//                              delete
// .delete(deleteProduct)
// router.route("/products/:id").delete(deleteProduct)

//Admin Routes
router.route('/products/new').post(authenctiate, authorizedPerson("admin"),upload.array("images") ,newProducts);
// get all Product
router.route("/admin/getProducts").get(authenctiate, authorizedPerson("admin"),AdminAllProduct)
router.route("/admin/deleteProduct/:id").delete(authenctiate, authorizedPerson("admin"),deleteProduct)
router.route("/admin/updateProduct/:id").put(authenctiate, authorizedPerson("admin"),upload.array("images"),updateProduct)

module.exports = router 