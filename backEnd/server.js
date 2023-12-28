const app=require("./app");
const dotenv=require("dotenv")
const path=require("path");
const databaseConnection = require("./config/dataBase");
  
dotenv.config({path:path.join(__dirname,"config/config.env")});

databaseConnection();
const server=app.listen(process.env.PORT,(req,res)=>{   
    console.log("server started ")
    
})        

process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled rejection error');
    server.close(()=>{
        process.exit(1);
    })
})


 

process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught exception error');
    server.close(()=>{
        process.exit(1);
    })
})

 