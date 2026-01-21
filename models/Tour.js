import mongoose from "mongoose";
import slugify from "slugify";

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
    slug: {
      type: String,
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
      default: "medium",
    },
    ratingsAverage:{
      type: Number,
      default: 3,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    
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
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: "Discount price must be below the regular price",
      },
      default: 0,
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
      required: [false, "A tour must have a cover image"],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: {
      type: [Date],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  {
    timestamps: true,
  }
);


tourSchema.virtual("durationWeeks").get(function() {
  const durationWeeks = this.duration / 7
  return durationWeeks.toFixed(2);
});
// Document Middleware: runs before .save() and .create()
tourSchema.pre("save", async function() {
  if(!this.isModified("name")) return;
  this.slug =  slugify(this.name, { lower: true, strict: true,trim: true });

});


// tourSchema.post("save", function(doc, next) {
//   console.log(doc);
//   next();
// });

//// Query Middleware: runs before .find(), .findOne(), .findOneAndUpdate(), .findOneAndDelete()
// tourSchema.pre("find", function(next) {
//   this.find({ slug: { $ne: undefined } });
//   next();
// });

// /// Aggregation Middleware: runs before .aggregate()
// tourSchema.pre("aggregate", function(next) {
//   console.log("this", this.pipeline());
//   this.pipeline().unshift({ $match: { slug: { $ne: undefined } } });
//   next();
// });



// tourSchema.index({ startDates: 1 });

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
