import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    googleId:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    picture:{
        type:String,
    }
})

const User=mongoose.model("User",userSchema,'users');


export default User;