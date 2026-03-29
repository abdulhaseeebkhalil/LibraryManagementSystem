import express from "express";
import { 
    register , 
    verifyOTP, 
    login, 
    logout,
    getUser,
    forgotPassword
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.post("/forgot-password", forgotPassword);

export default router;
