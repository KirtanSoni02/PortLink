import  express from "express" ;
import { LoginUser , RegisterUser } from "../controllers/authcontroller.js";
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Auth route is working");
});

router.post("/login",LoginUser);
router.post("/register",RegisterUser);

export default router;