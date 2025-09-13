import  express from "express" ;
import { LoginUser, RegisterUser , ResendOtp, SendOtp, VerifyOtp, GoogleAuth, CompleteGoogleProfile } from "../controllers/authcontroller.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Auth route is working");
});
router.post("/login",LoginUser);
router.post("/register",RegisterUser);
router.post("/send-otp", SendOtp);
router.post('/verify-otp', VerifyOtp);
router.post('/resend-otp', ResendOtp);
router.post('/google', GoogleAuth);
router.post('/complete-google-profile', CompleteGoogleProfile);


export default router;