import express from 'express';
import { getActiveShipsByPort } from '../controllers/shipController.js';
import  verifyToken  from '../middlewares/authmiddleware.js' 
import { getIncomingShipsToPort } from '../controllers/shipController.js'; 
import { getUpdatedShips } from '../controllers/shipController.js'; 


const router = express.Router();

router.get('/active', verifyToken, getActiveShipsByPort); 
router.get('/incoming', verifyToken, getIncomingShipsToPort); 

export default router;
