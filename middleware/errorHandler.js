/**
 * Centralized error handling middleware
 * Handles all errors and sends consistent error responses
 * Prevents duplicate responses by checking if headers have already been sent
 */
export const errorHandler = (err, req, res, next) => {
  // Check if response has already been sent
  if (res.headersSent) {
    return next(err);
  }

  // Determine status code - use existing status code or default to 500
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : (err.statusCode || 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
