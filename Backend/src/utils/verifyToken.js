const jwt = require("jsonwebtoken");
const catchAsync = require("./catchAsync");
const User = require("../models/userModel"); // your user model
const AppError = require("../utils/appError");

exports.verifyToken = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.token;
  if (!authHeader || !authHeader.startsWith("bearer")) {
    return res.status(401).json({
      status: "failed",
      message: "You are not logged in",
    });
  }

  const token = authHeader.split(" ")[1];

  // Verify JWT
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find the user in DB
  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({
      status: "failed",
      message: "User no longer exists",
    });
  }

  // Attach full user object
  req.user = user;

  next();
});
