import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        trim: true,
        maxlength: [10, "Name must be less than 10 characters"],
        minlength: [3, "Name must be at least 3 characters long"],
        validate: [validator.isAlphanumeric, "Name must only contain letters and numbers"],
    },
    profileImage: {
        type: String,
        default: "https://res.cloudinary.com/drneyxkqq/image/upload/v1768087485/samples/balloons.jpg",
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [4, "Password must be at least 4 characters long"],
        select: false,
    },
    role: {
        type: String,
        enum: ["user", "guide", "admin"],
        default: "user",
    },

},
    {
        timestamps: true,
    });

/**
 * Pre-save hook to hash password before saving
 * Only hashes password if it has been modified
 */
userSchema.pre("save", async function () {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) return;

    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
});


export default mongoose.model("User", userSchema);