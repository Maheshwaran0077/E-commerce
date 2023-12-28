const express = require("express")
const app = express();
const error = require('./middleWare/middleWare')
const cookieParser = require("cookie-parser")
const path = require("path")
const dotenv = require("dotenv")


dotenv.config({ path: path.join(__dirname, "config/config.env") });

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")))



const products = require("./route/product");
// const products=require("../backEnd/route/prooduct")


const auth = require("./route/userRoute");
const order = require("./route/order");
const payment = require("./route/payment")
app.use('/api/v1/', products);
app.use('/api/v1/', auth);
app.use('/api/v1/', order); 
app.use('/api/v1/', payment); 
 




app.use(error)
module.exports = app;



 // Mehroz Elahi