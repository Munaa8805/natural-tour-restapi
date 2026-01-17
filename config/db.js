import mongoose from "mongoose";

/**
 * Connect to MongoDB database
 * Requires MONGO_URI environment variable to be set
 */
const connectDB = async () => {
  try {
    // Validate MONGO_URI is set
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is not defined in environment variables. Please create a .env file with MONGO_URI."
      );
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`.green);
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error.message}`.red);
    process.exit(1);
  }
};

export default connectDB;
