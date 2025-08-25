import express from 'express';
import { getSailorDashboardData ,updateSailorProfile, getAvailableShipments,getContractHistory} from '../controllers/sailorController.js';
import verifyToken from '../middlewares/authmiddleware.js'; // Ensure this middleware is defined
import SailorModel from '../models/Sailor.model.js';
import JobPost from '../models/JobPost.model.js';

const router = express.Router();

router.get('/dashboard', verifyToken, getSailorDashboardData);
router.put('/edit-profile', verifyToken, updateSailorProfile);
router.get('/available-shipments', verifyToken, getAvailableShipments);
router.get('/contractshistory/:sailorId', verifyToken, getContractHistory);
router.post("/jobposts/assign-crew", verifyToken, async (req, res) => {
  const { shipmentId } = req.body;
  try {
    // Get userId from token (set by verifyToken middleware)
    const userId = req.user.id;

    // Find the Sailor document for this user
    const sailor = await SailorModel.findOne({ user: userId }).select("_id");
    if (!sailor) return res.status(404).json({ error: "Sailor not found" });

    // Find the JobPost
    const jobPost = await JobPost.findById(shipmentId);
    if (!jobPost) return res.status(404).json({ error: "Job post not found" });

    // Prevent duplicate assignment
    if (jobPost.crewAssigned.includes(sailor._id)) {
      return res.status(400).json({ error: "Sailor already assigned to this job" });
    }

    // Add sailor to crewAssigned
    jobPost.crewAssigned.push(sailor._id);
    jobPost.applicationsCount += 1;
    await jobPost.save();

    res.status(200).json({ message: "Sailor assigned successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;