import ErrorResponse from "../utils/errorResponse.js";

function errorHandler(err, req, res, next) {
    let error = { ...err };
    error.message = err.message;
    if (res.headersSent) {
        return next(err)
    }
    console.log(err.name);


    if (error.name === 'CastError') {
        error.statusCode = 400;
        error.message = `Invalid ${error.path}: ${error.value}`;
        error = new ErrorResponse(error.message, error.statusCode);

    }
    if (error.name === 'ValidationError') {
        error.statusCode = 400;
        error.message = `Invalid data. Please check your input!`;
        error = new ErrorResponse(error.message, error.statusCode);
    }
    if (error.code === 11000) {
        error.statusCode = 400;
        error.message = `Duplicate field value entered`;
        error = new ErrorResponse(error.message, error.statusCode);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        stack: error.stack,
    });
}

export default errorHandler;
