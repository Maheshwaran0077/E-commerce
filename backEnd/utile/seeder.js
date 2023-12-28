const products = require("../data/product.json")
const Product = require("../modules/productModule")
const dotenv = require("dotenv")

const dbConnection = require("../config/dataBase")

dotenv.config({ path: "backEnd/config/config.env" });
dbConnection();

const seeding = async (req, res) => {

    try { 
        await Product.deleteMany()
        console.log("Deleted")
        await Product.insertMany(products);
        console.log("added");
    } catch (err) {
        console.log(err.message)
    }
    process.exit();

}

seeding();