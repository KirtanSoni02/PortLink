import express from "express";
import { verifyToken } from "../middlewares/authmiddleware.js";

const router = express.Router();

router.get("/dashboard", verifyToken, (req, res) => {
    // If token is valid, this code runs
    res.status(200).json({
        message: `Welcome, your role is ${req.user.role}`,
        user: req.user,
    });
});

export default router;
