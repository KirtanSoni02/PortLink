import mongoose from "mongoose";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
const jwtt = process.env.JWT_SECRET; // Ensure this matches your .env file

const LoginUser = async (req, res) => {
    console.log("JWT_SECRET:", jwtt);
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ "message": "Invalid credentials" , "passwords" : {password, userPassword: user.password}});
        }
        console.log("Creating token with secret:",  jwtt);

        const token = jwt.sign({ id: user._id, role: user.role }, jwtt, { expiresIn: "7d" });

        const { password: _, ...userData } = user.toObject();
        return res.status(200).json({ ...userData, token });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const RegisterUser = async (req, res) => {
    const { firstName, lastName, email, phone, password, role, location, city, state, country, experience } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            password:hashedPassword,
            role,
            location,
            city,
            state,
            country,
            experience
        });

        await newUser.save();
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error",error: error.message });
    }
};

export default { LoginUser, RegisterUser };
