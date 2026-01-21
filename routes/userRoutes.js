import express from "express";
import { register, login } from "../controllers/authController.js";
import { getAllUsers, getUser, createUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

//// Auth Routes
router.post("/register", register).post("/login", login);


//// User Routes
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).delete(deleteUser);
export default router;