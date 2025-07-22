import express from 'express';
import { getSailorDashboardData ,updateSailorProfile, getAvailableShipments,getContractHistory} from '../controllers/sailorController.js';
import verifyToken from '../middlewares/authmiddleware.js'; // Ensure this middleware is defined


const router = express.Router();

router.get('/dashboard', verifyToken, getSailorDashboardData);
router.put('/edit-profile', verifyToken, updateSailorProfile);
router.get('/available-shipments', verifyToken, getAvailableShipments);
router.get('/contractshistory/:sailorId', verifyToken, getContractHistory);
export default router;
