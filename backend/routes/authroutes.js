import  express from "express" ;
import authcontroller from "../controllers/authcontroller.js";
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Auth route is working");
});

router.post("/login", authcontroller.LoginUser);

// router.post("/login", (req, res) => {
//   res.json({ message: "✅ Login route working" });
// });


router.post("/register", authcontroller.RegisterUser);

router.get("/test", (req, res) => {
  res.json({ message: "Test route working" });
});



export default router;