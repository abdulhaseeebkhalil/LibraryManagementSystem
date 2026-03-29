import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

// ✅ GET ALL USERS (Admin only)
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// ✅ REGISTER NEW ADMIN
export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ErrorHandler("User already exists", 400));
  }

  if (password.length < 8) {
    return next(new ErrorHandler("Password must be at least 8 characters", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin", // 🔥 IMPORTANT
    accountVerified: true, // skip email verification
  });

  res.status(201).json({
    success: true,
    message: "Admin created successfully",
    admin,
  });
});