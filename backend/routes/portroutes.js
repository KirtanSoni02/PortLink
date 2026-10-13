import express from "express";
import {
  createJobPost,
  getMyJobPosts,
  getPortOverview,
  getPortDashboardProfile,
  updatePortDashboardProfile,
} from "../controllers/port.js";
import verifyToken from "../middlewares/authmiddleware.js";

const router = express.Router();

router.get("/profile", verifyToken, getPortDashboardProfile);
router.put("/profile", verifyToken, updatePortDashboardProfile);
router.post("/jobs", verifyToken, createJobPost);
router.get("/jobs", verifyToken, getMyJobPosts);
router.get("/dashboard", verifyToken, getPortOverview);

export default router;
