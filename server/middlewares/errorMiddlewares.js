class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  if (err.code === 11000) {
    const statusCode = 400;
    const message = "User already exists";
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "CastError") {
    err.statusCode = 400;
    err.message = "Invalid ID";
  }

  if (err.name === "JsonWebTokenError") {
    const statusCode = 400;
    const message = "Invalid token";
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "TokenExpiredError") {
    const statusCode = 400;
    const message = "Token expired";
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "CastError") {
    const statusCode = 400;
    const message = `Resouses not found, Invalid ID: ${err.path}`;
    err = new ErrorHandler(message, statusCode);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(", ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    statusCode: err.statusCode,
    message: errorMessage,
  });
};

export default ErrorHandler;
