import ErrorResponse from "../utils/errorResponse.js";

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        stack: err.stack,
    });
}

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(500).json({
            success: false,
            status: "error",
            message: "Something went wrong",
        });
    }

}
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new ErrorResponse(message, 400);
}
const handleDuplicateFieldsDB = (err) => {
    const message = `Duplicate field value: ${err.keyValue.name}. Please use another value!`;
    return new ErrorResponse(message, 400);
}
const handleValidationErrorDB = (err) => {
    const message = `Invalid data. Please check your input!`;
    return new ErrorResponse(message, 400);
}

const handleJWTError = () => {
    return new ErrorResponse("Invalid token. Please log in again!", 401);
}

const handleJWTExpiredError = () => {
    return new ErrorResponse("Your token has expired! Please log in again.", 401);
}

/**
 * Global error handling middleware
 * Handles all errors and sends consistent error responses based on environment
 * Prevents duplicate responses by checking if headers have already been sent
 */
export const globalErrorHandler = (err, req, res, next) => {
    // Check if response has already been sent
    if (res.headersSent) {
        return next(err);
    }

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};