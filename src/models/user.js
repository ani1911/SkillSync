const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    age: {
      type: Number,
      min: 16,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    about: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    photourl: {
      type: String,
      default: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    },
    headline: {
      type: String,
      maxlength: 100,
      trim: true,
    },
    skills: {
      type: [String],
      validate: {
        validator: (v) => v.length <= 10,
        message: "Maximum 10 skills allowed",
      },
    },
    interests: {
      type: [String],
    },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    lookingFor: {
      type: String,
      enum: ["collaborator", "mentor", "project", "internship"],
    },
    availability: {
      type: String,
      enum: ["part-time", "full-time", "weekends"],
    },
    githubUrl: {
      type: String,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return validator.isURL(value);
        },
        message: "Invalid GitHub URL",
      },
    },
    linkedinUrl: {
      type: String,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return validator.isURL(value);
        },
        message: "Invalid LinkedIn URL",
      },
    },
    portfolioUrl: {
      type: String,
      validate: {
        validator: function (value) {
          if (!value) return true;
          return validator.isURL(value);
        },
        message: "Invalid Portfolio URL",
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, this.password);
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
