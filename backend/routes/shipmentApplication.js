import express from "express";
import {
  submitApplication,
  getApplicationsForJob,
  acceptApplication,
  rejectApplication,
} from "../controllers/shipmentApplicationController.js";
import verifyToken from "../middlewares/authmiddleware.js";

const router = express.Router();

router.post("/", submitApplication);
router.post("/apply", submitApplication);
router.get("/job/:jobId", verifyToken, getApplicationsForJob);
router.put("/:applicationId/accept", verifyToken, acceptApplication);
router.put("/:applicationId/reject", verifyToken, rejectApplication);

export default router;