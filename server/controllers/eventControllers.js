import Event from "../model/eventModel.js";



export const createEvent=async(req ,res)=>{
try{
const {title,description,startTime,endTime,color}=req.body;
const userId=req.userId;

const event=await Event.create({
    userId,
    title,
    description,
    startTime,
    endTime,
    color,  
})
res.status(201).json({event});
}catch(error){
    res.status(500).json({error:error.message});
}
}


export const getEvents=async(req,res)=>{
    try{
    const userId=req.userId;
    const events =await Event.find({userId}).sort({startTime:1});
    res.status(200).json(events);
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

export const updateEvent=async(req,res)=>{
    try{
    const {id}=req.params;
    const updatedData=req.body;
    const event=await Event.findByIdAndUpdate(id,updatedData,{new:true});

if(!event){
    return res.status(404).json({message:"Event not found"});
    res.status(200).json(event)
}}catch(error){
    res.status(500).json({message:'failed to updated event'})
}
    }


    export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event" });
  }
};