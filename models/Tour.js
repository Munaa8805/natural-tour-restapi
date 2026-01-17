import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "A tour must have a name"],
      maxlength: [40, "A tour name must have less than 40 characters"],
      minlength: [5, "A tour name must have at least 5 characters"],
    },
    duration:{
      type: Number,
      required: [true, "A tour must have a duration. Must be between 1 and 10 days"],
      min: [1, "Duration must be at least 1 day"],
      max: [10, "Duration must be less than 10 days"],
    },
    maxGroupSize:{
      type: Number,
      required: [true, "A tour must have a maximum group size. Must be between 5 and 20"],
      min: [5, "Maximum group size must be at least 5"],
      max: [20, "Maximum group size must be less than 20"],
    },
    difficulty:{
      type: String,
      required: [true, "A tour must have a difficulty. Must be easy, medium, or difficult"],
      enum: ["easy", "medium", "difficult"],
    },
    ratingsAverage:{
      type: Number,
      default: 4.5,
    
    },
    ratingsQuantity:{
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
      min: [0, "Price must be above 0"],
    },
    priceDiscount: {
      type: Number,
      
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [400, "A tour summary must have less than 400 characters"],
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "A tour description must have less than 2000 characters"],
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: {
      type: [Date],
    },
  },
  {
    timestamps: true,
  }
);

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
