import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import Borrow from "../models/borrowModel.js";
import User from "../models/userModel.js";
import Book from "../models/bookModel.js";

// ✅ Borrow Book
export const recordBorrowedBook = catchAsyncErrors(
  async (req, res, next) => {
    const { bookId } = req.params;
    const { email } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return next(new ErrorHandler("Book not found", 404));

    const user = await User.findOne({ email });
    if (!user) return next(new ErrorHandler("User not found", 404));

    if (book.quantity === 0) {
      return next(new ErrorHandler("Book not available", 400));
    }

    const alreadyBorrowed = await Borrow.findOne({
      bookId,
      userId: user._id,
      returned: false,
    });

    if (alreadyBorrowed) {
      return next(new ErrorHandler("Book already borrowed", 400));
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const borrow = await Borrow.create({
      bookId,
      userId: user._id,
      dueDate,
    });

    // update user
    user.borrowedBooks.push({
      bookId: book._id,
      bookTitle: book.title,
      dueDate,
      returnedDate: false,
    });
    await user.save();

    // update book quantity
    book.quantity -= 1;
    await book.save();

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      borrow,
    });
  }
);

// ✅ Admin - All Borrowed
export const getBorrowedBookForAdmin = catchAsyncErrors(
  async (req, res) => {
    const borrows = await Borrow.find()
      .populate("userId", "name email")
      .populate("bookId", "title");

    res.status(200).json({
      success: true,
      borrows,
    });
  }
);

// ✅ User - My Borrowed
export const getBorrowedBookForUser = catchAsyncErrors(
  async (req, res) => {
    const borrows = await Borrow.find({
      userId: req.user._id,
    }).populate("bookId", "title");

    res.status(200).json({
      success: true,
      borrows,
    });
  }
);

// ✅ Return Book
export const returnBorrowedBook = catchAsyncErrors(
  async (req, res, next) => {
    const { bookId } = req.params;

    const borrow = await Borrow.findOne({
      bookId,
      userId: req.user._id,
      returned: false,
    });

    if (!borrow) {
      return next(new ErrorHandler("Borrow record not found", 404));
    }

    borrow.returned = true;
    borrow.returnedAt = Date.now();
    await borrow.save();

    // update book quantity
    const book = await Book.findById(bookId);
    book.quantity += 1;
    await book.save();

    res.status(200).json({
      success: true,
      message: "Book returned successfully",
    });
  }
);