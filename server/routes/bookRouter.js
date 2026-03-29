import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { addBook, deleteBook, getAllBooks } from "../controllers/bookController.js";
import express from "express";

const router = express.Router();

router.post(
  "/admin/add",
  isAuthenticated,
  isAuthorized("admin"),
  catchAsyncErrors(addBook)
);

router.get(
  "/all",
  isAuthenticated,
  catchAsyncErrors(getAllBooks)
);

router.delete(
  "/admin/delete/:id",
  isAuthenticated,
  isAuthorized("admin"),
  catchAsyncErrors(deleteBook)
);

export default router;
