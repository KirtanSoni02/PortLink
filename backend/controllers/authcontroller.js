import mongoose from "mongoose";
import User from "../models/User.model.js";
import PortAuthority from "../models/PortAuthority.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Sailor from "../models/Sailor.model.js";
import { randomInt } from "crypto";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
dotenv.config(); // Load environment variables from .env file
const jwtt = process.env.JWT_SECRET; // Ensure this matches your .env file

const otpStore = new Map();

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

// const RegisterUser = async (req, res) => {
//     const { firstName, lastName, email, phone, password, role, location, city, state, country, experience, selectedPort } = req.body;
//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(409).json({ message: "User already exists" });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new User({
//             firstName,
//             lastName,
//             email,
//             phone,
//             password:hashedPassword,
//             role,
//             location,
//             city,
//             state,
//             country,
//             experience
//         });

//         if (role === 'port') {
//             await PortAuthority.create({
//                 user: newUser._id,
//                 portName: req.body.selectedPort,
//                 location: {
//                     city: req.body.city,
//                     state: req.body.state,
//                     country: req.body.country
//             },
//                 totalShipsInTransit: 0,
//                 totalIncomingShips: 0,
//                 totalContractsCompleted: 0,
//                 activeJobPosts: 0,
//                 registeredSailors: 0
//         });
// }

//  if (role === 'sailor') {
//       await Sailor.create({
//         user: newUser._id,
//         rating: randomInt(1,5)
//       });
//     }
//         console.log("New user data:", newUser);
//         await newUser.save();
//         return res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         console.error("Error registering user:", error);
//         return res.status(500).json({ message: "Internal server error",error: error.message });
//     }
// };

const RegisterUser = async (req, res) => {
  const { 
    firstName, lastName, email, phone, password, role, 
    location, city, state, country, experience, selectedPort,
    googleId, verificationToken // Add verificationToken parameter
  } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Check if email is verified via OTP
    let isEmailVerified = false;
    if (verificationToken) {
        isEmailVerified = true;
        // Clean up the OTP entry after successful verification
        otpStore.delete(verificationToken);
      
    }

    let hashedPassword;
    if (password && !googleId) {
      // Only hash password for non-Google users
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword, // Will be null for Google users
      role,
      location,
      city,
      state,
      country,
      experience,
      googleId, // Will be null for password users
      isEmailVerified: isEmailVerified || !!googleId, // Set based on OTP verification or Google auth
      profileComplete: true
    });

    await newUser.save();

    // Create appropriate profiles
    if (role === 'port') {
      await PortAuthority.create({
        user: newUser._id,
        portName: selectedPort,
        location: { city, state, country },
        totalShipsInTransit: 0,
        totalIncomingShips: 0,
        totalContractsCompleted: 0,
        activeJobPosts: 0,
        registeredSailors: 0
      });
    } else if (role === 'sailor') {
      await Sailor.create({
        user: newUser._id,
        rating: randomInt(1, 5)
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = newUser.toObject();
    
    return res.status(201).json({ 
      success: true,
      message: "User registered successfully",
      user: userData,
      token 
    });
    
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error", 
      error: error.message 
    });
  }
};

const SendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        error: 'User already exists with this email' 
      });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const token = crypto.randomBytes(32).toString('hex');
    
    // Store OTP with expiration (10 minutes)
    otpStore.set(token, {
      email,
      otp,
      expires: Date.now() + 10 * 60 * 1000,
      verified: false // Initial verification status
    });
    
    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for PortLink Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>PortLink Email Verification</h2>
          <p>Your OTP code is: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      token,
      message: 'OTP sent successfully' 
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send OTP' 
    });
  }
};

const VerifyOtp = async (req, res) => {
  try {
    const { email, otp, token } = req.body;
    
    const storedData = otpStore.get(token);
    
    if (!storedData || storedData.email !== email) {
      return res.json({ success: false, error: 'Invalid token' });
    }
    
    if (Date.now() > storedData.expires) {
      otpStore.delete(token);
      return res.json({ success: false, error: 'OTP expired' });
    }
    
    if (storedData.otp !== otp) {
      return res.json({ success: false, error: 'Invalid OTP' });
    }
    
    // OTP is valid - mark the email as verified in the OTP store
    // We'll handle the actual user update during registration
    otpStore.set(token, {
      ...storedData,
      verified: true // Add a verified flag
    });
    
    res.json({ 
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

const ResendOtp = async (req, res) => {
  try {
    const { email, token } = req.body;
    
    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Update stored OTP
    if (otpStore.has(token)) {
      otpStore.set(token, {
        email,
        otp,
        expires: Date.now() + 10 * 60 * 1000
      });
    } else {
      return res.status(400).json({ error: 'Invalid token' });
    }
    
    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your New OTP for PortLink Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>PortLink Email Verification</h2>
          <p>Your new OTP code is: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
}; 

const GoogleAuth = async (req, res) => {
  try {
    const { token, mode } = req.body;

    if (!token) {
      return res.status(400).json({ 
        success: false,
        error: 'Google token is required' 
      });
    }

    try {
      // Get user info using the access token
      const userInfoResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const userInfo = userInfoResponse.data;
      const { sub: googleId, email, name, picture, email_verified } = userInfo;

      // Check if user already exists
      let user = await User.findOne({ 
        $or: [{ email }, { googleId }] 
      });

      if (user) {
        // User exists - generate JWT and log them in
        const jwtToken = jwt.sign(
          { id: user._id, role: user.role }, 
          process.env.JWT_SECRET, 
          { expiresIn: "7d" }
        );

        const { password: _, ...userData } = user.toObject();
        
        return res.json({
          success: true,
          user: userData,
          token: jwtToken,
          profileComplete: user.profileComplete,
          mode: 'login'
        });
      }

      // New user - return Google data for profile completion
      if (mode === 'register') {
        const nameParts = name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        return res.json({
          success: true,
          googleData: {
            googleId,
            email,
            firstName,
            lastName,
            profilePicture: picture,
            emailVerified: email_verified
          },
          profileComplete: false,
          mode: 'register'
        });
      } else {
        return res.status(404).json({ 
          success: false,
          error: 'No account found with this Google email. Please register first.' 
        });
      }

    } catch (googleError) {
      console.error('Google API error:', googleError.response?.data || googleError.message);
      return res.status(401).json({ 
        success: false,
        error: 'Failed to verify Google token' 
      });
    }

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Google authentication failed' 
    });
  }
};

const CompleteGoogleProfile = async (req, res) => {
  try {
    const { googleData, ...profileData } = req.body;
    
    if (!googleData || !googleData.googleId) {
      return res.status(400).json({ error: 'Google data is required' });
    }

    // Check if user already exists with this Google ID
    const existingUser = await User.findOne({ googleId: googleData.googleId });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Check if email is already registered
    const existingEmail = await User.findOne({ email: googleData.email });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create new user with Google data and form data
    const user = new User({
      googleId: googleData.googleId,
      email: googleData.email,
      firstName: profileData.firstName || googleData.firstName,
      lastName: profileData.lastName || googleData.lastName,
      profilePicture: googleData.profilePicture,
      isEmailVerified: true,
      profileComplete: true,
      phone: profileData.phone,
      role: profileData.role,
      location: profileData.location,
      city: profileData.city,
      state: profileData.state,
      country: profileData.country,
      experience: profileData.experience
    });

    await user.save();

    // Create appropriate profile based on role
    if (profileData.role === 'port') {
      await PortAuthority.create({
        user: user._id,
        portName: profileData.selectedPort,
        location: {
          city: profileData.city,
          state: profileData.state,
          country: profileData.country
        },
        totalShipsInTransit: 0,
        totalIncomingShips: 0,
        totalContractsCompleted: 0,
        activeJobPosts: 0,
        registeredSailors: 0
      });
    } else if (profileData.role === 'sailor') {
      await Sailor.create({
        user: user._id,
        rating: randomInt(1, 5)
      });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = user.toObject();
    
    res.json({
      success: true,
      user: userData,
      token: jwtToken,
      profileComplete: true
    });
    
  } catch (error) {
    console.error('Complete profile error:', error);
    res.status(500).json({ error: 'Failed to complete profile' });
  }
};

export { LoginUser, RegisterUser, SendOtp, VerifyOtp, ResendOtp, GoogleAuth, CompleteGoogleProfile };
