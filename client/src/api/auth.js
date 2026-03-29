import API from "./axios";

// REGISTER
export const registerUser = (data) =>
  API.post("/auth/register", data);

// VERIFY OTP
export const verifyOTP = (data) =>
  API.post("/auth/verify-otp", data);

// LOGIN
export const loginUser = (data) =>
  API.post("/auth/login", data);

// GET USER
export const getUser = () =>
  API.get("/auth/me");