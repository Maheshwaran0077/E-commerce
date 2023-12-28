const mongoose=require("mongoose");
const databaseConnection=()=>{
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useunifiedTopology:true,
        useNewUrlParser:true,
        //update for mongodb
    }).then(con=>{ 
        console.log(`the database is connected to ${ con.connection.host}`)
    })
}  
 
module.exports=databaseConnection;      