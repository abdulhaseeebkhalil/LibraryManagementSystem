import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddlewares.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const {token} = req.cookies;
  if (!token){
    return next(new ErrorHandler("User not logged in", 401));
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await User.findById(decodedToken.id);
  if (!user){
    return next(new ErrorHandler("User not found", 404));
  }
  req.user = user;
  next();
});

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(
        `User ${req.user.role} not authorized to access this resource`,
        403
      ));
    }
    next();
  };
};