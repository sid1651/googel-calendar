import express from'express'
import { verifyToken } from '../middleware/authMiddleware.js';
import { createEvent, deleteEvent, getEvents, updateEvent } from '../controllers/eventControllers.js';



const router=express.Router();

router.post('/',verifyToken,createEvent)
router.get('/',verifyToken,getEvents)
router.put('/:id',verifyToken,updateEvent)
router.delete('/:id',verifyToken,deleteEvent)

export default router;
