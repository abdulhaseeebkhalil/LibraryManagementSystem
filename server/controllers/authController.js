import bcrypt from "bcrypt";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import User from "../models/userModel.js";
import { generateResetPasswordEmailTemplate } from "../utils/emailTemplet.js";
import { sendEmail } from "../utils/sendEmails.js";
import { sendToken } from "../utils/sendToken.js";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";

// export const register = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) {
//       return next(new ErrorHandler("Please fill all the fields.", 400));
//     }
//     const isRegistered = await User.findOne({ email, accountVerified: true });
//     if (isRegistered) {
//       return next(new ErrorHandler("User already registered.", 400));
//     }
//     const registerationAttemptByUser = await User.findOne({
//       email,
//       accountVerified: false,
//     });
//     if (registerationAttemptByUser.length >= 5) {
//       return next(
//         new ErrorHandler("Too many attempts. Please try again later.", 400),
//       );
//     }
//     if (password.length < 8 || password.length > 16) {
//       return next(
//         new ErrorHandler(
//           "Password must be between 8 and 16 characters long.",
//           400,
//         ),
//       );
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });
//     const verificationCode = await user.generateVerificationCode();
//     await user.save();
//     sendVerificationCode(verificationCode, email);
//     res.status(201).json({
//       success: true,
//       message: "User registered successfully.",
//       user,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all the fields.", 400));
  }

  const isRegistered = await User.findOne({ email, accountVerified: true });
  if (isRegistered) {
    return next(new ErrorHandler("User already registered.", 400));
  }

  const registrationAttempts = await User.countDocuments({
    email,
    accountVerified: false,
  });

  if (registrationAttempts >= 15) {
    return next(
      new ErrorHandler("Too many attempts. Please try again later.", 400),
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // 1. Generate the code
  const verificationCode = await user.generateVerificationCode();
  await user.save();

  try {
    // 2. Await the email sending process
    await sendVerificationCode(verificationCode, email);

    res.status(201).json({
      success: true,
      message: "User registered successfully. Check your email!",
      verificationCode, // 3. Added here so you can see it in Postman
      user,
    });
  } catch (error) {
    // If email fails, we still want to tell the user there was a problem
    return next(
      new ErrorHandler("User created but email failed to send.", 500),
    );
  }
});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return next(
      new ErrorHandler("Please provide email and verification code.", 400),
    );
  }
  try {
    const userAllEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });

    if (!userAllEntries || userAllEntries.length === 0) {
      return next(new ErrorHandler("User not found", 404));
    }

    let user;

    if (userAllEntries.length > 1) {
      user = userAllEntries[0];
      await User.deleteMany({
        id: { $ne: user._id },
        email,
        accountVerified: false,
      });
    } else {
      user = userAllEntries[0];
    }

    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid verification code.", 400));
    }
    const currentTime = Date.now();

    const verficationCodeExpiry = new Date(
      user.verificationCodeExpiry,
    ).getTime();

    if (currentTime > verficationCodeExpiry) {
      return next(new ErrorHandler("Verification code has expired.", 400));
    }
    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save({ validateModifiedOnly: true });

    sendToken(user, 200, "User verified successfully", res);
  } catch (error) {
    return next(new ErrorHandler("Failed to verify user.", 500));
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password.", 400));
  }
  try {
    const user = await User.findOne({ email, accountVerified: true }).select(
      "+password",
    );
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid password.", 400));
    }
    sendToken(user, 200, "User logged in successfully", res);
  } catch (error) {
    return next(new ErrorHandler("Failed to login user.", 500));
  }
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to logout user.", 500));
  }
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
//   if (!req.body.email){
//     return next(new ErrorHandler("Please provide email.", 400));
//   }
//   const user = await User.findOne({
//     email: req.body.email,
//     accountVerified: true
//   });
//   if (!user){
//     return next(new ErrorHandler("User not found", 400));
//   }
//   const resetToken = user.getResetPasswordToken();

//   await user.save({validateModifiedOnly: false});

//   const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

//   const message = generateResetPasswordEmailTemplate(resetPasswordUrl);

//   try {
//     await sendEmail(
//       {
//         email: user.email,
//         subject: "Bookworm library management system - Reset recovery",
//         message,
//       }
//     );
//     res.status(200).json({
//       success: true,
//       message: `Reset password link sent to ${user.email}`,
//     });
//   } catch (error) {
//     user.resetPasswordCode = undefined;
//     user.resetPasswordCodeExpiry = undefined;
//     await user.save({validateModifiedOnly: false});
//     return next(new ErrorHandler("Failed to send reset password link", 500));
//   }
// });

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Please provide email.", 400));
  }

  const user = await User.findOne({
    email,
    accountVerified: true,
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  // ✅ Generate reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateModifiedOnly: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const message = `Reset your password here: ${resetPasswordUrl}`;
  try {
  await sendEmail({
    email: user.email,
    subject: "Bookworm Library - Password Reset",
    message,
  });
  console.log(message);
  res.status(200).json({
    success: true,
    message: `Reset link sent to ${user.email}`,
  });

} catch (error) {
  // cleanup if email fails
  user.resetPasswordCode = undefined;
  user.resetPasswordCodeExpiry = undefined;

  await user.save({ validateModifiedOnly: false });

  return next(new ErrorHandler("Failed to send reset email", 500));
}
});
