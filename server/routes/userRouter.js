import express from "express";
import {
  getAllUsers,
  registerNewAdmin,
} from "../controllers/userController.js";

import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Admin only
router.get(
  "/admin/users",
  isAuthenticated,
  isAuthorized("admin"),
  getAllUsers
);

// ✅ Create Admin
router.post(
  "/admin/create",
  isAuthenticated,
  isAuthorized("admin"),
  registerNewAdmin
);

export default router;