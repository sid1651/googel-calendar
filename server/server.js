import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connetDb from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRouter.js';

dotenv.config()
const app=express();
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

connetDb()



app.get('/',(req,res)=>{
    res.send("API is running...");
});

const PORT=process.env.PORT||5000;
app.use ('/api/auth',authRoutes)
app.use('/api/events',eventRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})