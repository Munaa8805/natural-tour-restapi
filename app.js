import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";
import path from "path";
import connectDB from "./config/db.js";
import tourRoutes from "./routes/tourRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const options = {
  origin: [
    "http://localhost:3000",
    "https://shopping-frontend-seven.vercel.app/",
  ],
};
colors.enable();
connectDB();

// Middleware
app.use(cors(options));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    abortOnLimit: true,
  })
);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Routes
app.use("/api/v1/tours", tourRoutes);

// 404 handler - only runs if no route matches
app.use((req, res, next) => {
  // Check if headers have already been sent (shouldn't happen, but safety check)
  if (res.headersSent) {
    return next();
  }
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Error handler middleware
app.use(errorHandler);

export default app;
