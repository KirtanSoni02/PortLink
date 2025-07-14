import express from 'express';
import { getAllCompletedContracts } from '../controllers/CompletedContractController.js';
import verifyToken from '../middlewares/authmiddleware.js';

// Define your routes for completed contracts here
const router = express.Router();
router.get('/completed',verifyToken, getAllCompletedContracts);

export default router;
    