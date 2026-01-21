import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: "success",
            data: users,
        });
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

export const createUser = async (req, res, next) => {
    try {

        const newUser = await User.create(req.body);
        res.status(201).json({
            status: "success",
            data: newUser,
        });
    } catch (error) {
        next(error);
    }
}
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }
        await user.deleteOne();
        res.status(204).json({
            status: "success",
            message: "User deleted successfully",
            data: {},
        });
    } catch (error) {
        next(error);
    }
}