import express from "express";
import verifyToken from "../middlewares/authmiddleware.js";
import {
  getMyJobPosts,
  ConvertToShip,
  deleteJobPost,
  viewJobPost,
} from "../controllers/activejobController.js";
const router = express.Router();

router.get("/activejobpost", verifyToken, ConvertToShip, getMyJobPosts);

router.delete("/delete/:jobId", verifyToken, deleteJobPost);

router.get("/view/:jobId", verifyToken, viewJobPost);

export default router;
