import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    borrowedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Borrow",
        },
        borrowedDate: {
          type: Date,
          default: Date.now,
        },
        returnedDate: {
          type: Boolean,
          default: false,
        },
        bookTitle: {
          type: String,
          borrowedDate: Date,
          dueDate: Date,
          returnedDate: Date,
          required: true,
        },
        dueDate: {
          type: Date,
          required: true,
        },
      },
    ],
    avatar: {
      public_id: String,
      url: String,
    },
    verificationCode: Number,
    verificationCodeExpiry: Date,
    resetPasswordCode: String,
    resetPasswordCodeExpiry: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.methods.generateVerificationCode = async function () {
  function generateRandomFiveDigitCode() {
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const reminingDigit = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(4, "0");
    return parseInt(firstDigit + reminingDigit);
  }
  const verificationCode = generateRandomFiveDigitCode();
  this.verificationCode = verificationCode;
  this.verificationCodeExpiry = Date.now() + 10 * 60 * 1000;
  return verificationCode;
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordCode = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordCodeExpiry = Date.now() + 15 * 60 * 1000; // 15 min

  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
