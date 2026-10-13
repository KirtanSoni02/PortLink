import express from "express";
import {
  getSailorDashboardData,
  updateSailorProfile,
  getAvailableShipments,
  getContractHistory,
} from "../controllers/sailorController.js";
import verifyToken from "../middlewares/authmiddleware.js"; // Ensure this middleware is defined
import SailorModel from "../models/Sailor.model.js";
import JobPost from "../models/JobPost.model.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/dashboard", verifyToken, getSailorDashboardData);
router.put(
  "/edit-profile",
  verifyToken,
  upload.single("profilePicture"),
  updateSailorProfile
);
router.get("/available-shipments", verifyToken, getAvailableShipments);
router.get("/contractshistory/:sailorId", verifyToken, getContractHistory);
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

    // Atomic update to prevent race conditions
    // We check if the sailor is NOT already assigned AND if there is space left.
    // $addToSet ensures no duplicates (though we check explicitly too).
    // But to handle "spots left", we need to check array size.
    // MongoDB doesn't support checking array size directly in query easily without aggregation or $where (slow).
    // A better schema would have 'spotsFilled' counter.
    // Assuming 'sailorsRequired' is the total capacity.
    
    // Let's try to use findOneAndUpdate with a condition on the array size if possible, 
    // or just rely on the fact that we are pushing.
    // Actually, we can use the 'applicationsCount' or just check the array length in the query if we use $expr.
    
    const updatedJob = await JobPost.findOneAndUpdate(
      { 
        _id: shipmentId, 
        crewAssigned: { $ne: sailor._id }, // Not already assigned
        $expr: { $lt: [{ $size: "$crewAssigned" }, "$sailorsRequired"] } // Less than required
      },
      { 
        $push: { crewAssigned: sailor._id },
        $inc: { applicationsCount: 1 }
      },
      { new: true }
    );

    if (!updatedJob) {
        // Check why it failed
        const existingJob = await JobPost.findById(shipmentId);
        if (!existingJob) return res.status(404).json({ error: "Job post not found" });
        if (existingJob.crewAssigned.includes(sailor._id)) {
            return res.status(400).json({ error: "Sailor already assigned to this job" });
        }
        if (existingJob.crewAssigned.length >= existingJob.sailorsRequired) {
            return res.status(400).json({ error: "Job post is full" });
        }
        return res.status(500).json({ error: "Failed to assign crew" });
    }

    // jobPost.crewAssigned.push(sailor._id);
    // jobPost.applicationsCount += 1;
    // await jobPost.save();

    res.status(200).json({ message: "Sailor assigned successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;
