import mongoose from "mongoose";


const eventSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        default:'',
    },
    startTime:{
        type:Date,
        required:true,
    },
    endTime:{
        type:Date,
        required:true,
    },
    color:{
        type:String,
        default:'#3788d8',  
    }
},{timestamps:true});

const Event=mongoose.model("Event",eventSchema,'events');

export default Event;