const mongoose = require("mongoose");
const validator = require("validator");

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
      select: false,
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
      default: "https://default-photo.png",
    },
    headline: {
      type: String,
      maxlength: 100,
    },
    skills: {
      type: [String],
      validate: {
        validator: (v) => v.length < 10,
        message: "maximum 10 skill allowed",
      },
    },
    interesets: {
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
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid url");
        }
      },
    },

    linkedinUrl: {
      type: String,
    },

    portfolioUrl: {
      type: String,
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

module.exports = mongoose.model("User", userSchema);
