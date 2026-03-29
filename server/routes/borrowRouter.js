import express from "express";
import {
  recordBorrowedBook,
  getBorrowedBookForAdmin,
  getBorrowedBookForUser,
  returnBorrowedBook,
} from "../controllers/borrowController.js";

import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin borrow record
router.post(
  "/borrow/:bookId",
  isAuthenticated,
  isAuthorized("admin"),
  recordBorrowedBook
);

// Admin view all
router.get(
  "/admin",
  isAuthenticated,
  isAuthorized("admin"),
  getBorrowedBookForAdmin
);

// User view own
router.get(
  "/me",
  isAuthenticated,
  getBorrowedBookForUser
);

// Return book
router.put(
  "/return/:bookId",
  isAuthenticated,
  returnBorrowedBook
);

export default router;