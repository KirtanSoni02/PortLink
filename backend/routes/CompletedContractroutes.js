import express from 'express';
import { getAllCompletedContracts ,deleteCompletedContract } from '../controllers/CompletedContractController.js';
import verifyToken from '../middlewares/authmiddleware.js';

// Define your routes for completed contracts here
const router = express.Router();
router.get('/completed',verifyToken, getAllCompletedContracts);
router.delete('/delete/:id', verifyToken, deleteCompletedContract);
export default router;
    