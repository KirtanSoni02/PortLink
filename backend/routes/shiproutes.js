import express from 'express';
import { getActiveShipsByPort } from '../controllers/shipController.js';
import  verifyToken  from '../middlewares/authmiddleware.js' // if using JWT middleware
import { getIncomingShipsToPort } from '../controllers/shipController.js'; // Import the controller function
const router = express.Router();

router.get('/active', verifyToken, getActiveShipsByPort);
router.get('/incoming', verifyToken, getIncomingShipsToPort);

export default router;
