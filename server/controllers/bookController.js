import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";

// export const addBook = catchAsyncErrors(async (req, res, next) => {
//   const {
//     title,
//     author,
//     description,
//     price,
//     isbn,
//     genre,
//     publishedDate,
//     quantity,
//     coverImage,
//   } = req.body;
//   if (
//     !title ||
//     !author ||
//     !description ||
//     !price ||
//     !isbn ||
//     !genre ||
//     !publishedDate ||
//     !quantity ||
//     !coverImage
//   ) {
//     const book = await Book.create({
//       title,
//       author,
//       description,
//       price,
//       isbn,
//       genre,
//       publishedDate,
//       quantity,
//       coverImage,
//     });
//     return next(new ErrorHandler("All fields are required", 400));
//   }
//   res.status(201).json({
//     success: true,
//     message: "Book added successfully",
//     book,
//   });
// });

export const addBook = catchAsyncErrors(async (req, res, next) => {
  const {
    title, author, description, price, isbn, genre, publishedDate, quantity, coverImage,
  } = req.body;

  // 1. Validation: If ANY field is missing, return error immediately
  if (!title || !author || !description || !price || !isbn || !genre || !publishedDate || !quantity || !coverImage) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  // 2. Creation: Only runs if all fields exist
  const book = await Book.create({
    title, author, description, price, isbn, genre, publishedDate, quantity, coverImage,
  });

  // 3. Success Response
  res.status(201).json({
    success: true,
    message: "Book added successfully",
    book,
  });
});


export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
    const books = await Book.find();
    res.status(200).json({
        success: true,
        books,
    });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
    const {id} = req.params;
    const book = await Book.findById(id);
    if(!book){
        return next(new ErrorHandler("Book not found", 404));
    }
    await book.deleteOne();
    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
    });
});


