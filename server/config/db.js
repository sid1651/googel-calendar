import mongoose from "mongoose";

const connetDb=async()=>{
    try{
        mongoose.connection.on('connected',()=>console.log("MongoDB connected"));
        mongoose.connection.on('error',(err)=>{
            console.log("MongoDB connection error:",err);
        });
await mongoose.connect(process.env.MONGODB_URI,{
    dbName:"calender",
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
});
console.log("MongoDB connected successfully");  
    }catch(error){

    }
}

export default connetDb;