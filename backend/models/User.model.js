import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: function () {
        return !this.googleId;
      }, // Required only for non-Google users
    },
    lastName: {
      type: String,
      required: function () {
        return !this.googleId;
      }, // Required only for non-Google users
    },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      }, // Required only for non-Google users
    },
    role: { type: String, enum: ["sailor", "port", "service"], required: true },
    location: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    experience: { type: String, enum: ["yes", "no"] },

    // Google authentication fields
    googleId: {
      type: String,
      sparse: true, // Allows null values but ensures uniqueness for non-null
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: { type: String },
    profileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving (only for non-Google users and when password is modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.googleId) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.models.User || mongoose.model("User", userSchema);