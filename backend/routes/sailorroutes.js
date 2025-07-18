import express from 'express';
import { getSailorDashboardData ,updateSailorProfile} from '../controllers/sailorController.js';
import verifyToken from '../middlewares/authmiddleware.js'; // Ensure this middleware is defined
const router = express.Router();

router.get('/dashboard', verifyToken, getSailorDashboardData);
router.put('/edit-profile', verifyToken, updateSailorProfile);

export default router;
