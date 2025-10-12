const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your username."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an email."],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email."],
    },
    password: {
      type: String,
      required: [true, "Please enter your password."],
    },
    image: {
      type: String,
      required: [true, "Provide a valid image"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
