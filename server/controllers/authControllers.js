import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../model/usermodel.js';

const client =new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth=async(req,res)=>{
    try{
  const {token}=req.body;

  const ticket =await client.verifyIdToken({
    idToken:token,
    audience:process.env.GOOGLE_CLIENT_ID,
  })
  const payload=ticket.getPayload()

  const {sub,name,email,picture}=payload;
console.log("Payload audience:", payload.aud);
console.log("Expected audience:", process.env.GOOGLE_CLIENT_ID);

  let user =await User.findOne({googleId:sub})
  if(!user){
    user=new User({
        googleId:sub,
        name,
        email,
        picture,
    })
    await user.save();
  }
  const jwtToken=jwt.sign({id:user._id},process.env.JWT_SECRET,{
    expiresIn:'7d',
  });   
  res.status(200).json({user,jwtToken});
    }
    catch(error){
console.error("Error in googleAuth:",error);
res.status(401).json({message:"Authentication failed"});
    }
}