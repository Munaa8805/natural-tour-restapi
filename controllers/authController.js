import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";



const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};

const sendTokenResponse = (user, statusCode, req, res) => {
    const token = signToken(user._id);

    res.cookie('token', token, {
        expires: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

export const register = asyncHandler(async (req, res, next) => {

    const { name, email, password, role, photo } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorResponse("Please provide name, email and password", 400));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorResponse("User already exists with this email", 400));
    }

    const user = await User.create({ name, email, password, role, profileImage: photo });
    const token = signToken(user._id);
    res.status(201).json({
        status: "success",
        message: "User created successfully",
        token,
        data: user,
    });

});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 400));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return next(new ErrorResponse("Invalid credentials", 400));
    }

    sendTokenResponse(user, 200, req, res);
});


export const logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
    });
});

