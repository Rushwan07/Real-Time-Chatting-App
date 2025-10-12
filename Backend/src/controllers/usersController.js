const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError"); // ✅ import AppError
const dotenv = require("dotenv");
dotenv.config();

exports.signup = catchAsync(async (req, res, next) => {
    const { email, username, password, image } = req.body;

    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser) {
        let message;
        if (existingUser.email === email) message = "Email is already registered";
        else if (existingUser.username === username) message = "Username is already taken";

        return next(new AppError(message, 400)); // ✅ use AppError
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    const newUser = await User.create({
        email,
        username,
        password: hashedPassword,
        image,
    });

    const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRECT,
        { expiresIn: process.env.LOGIN_EXPIRES }
    );

    newUser.password = undefined;

    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser,
        },
    });
});

exports.signin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new AppError("Invalid email or password", 401));
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
        return next(new AppError("Invalid email or password", 401));
    }

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRECT,
        { expiresIn: process.env.LOGIN_EXPIRES }
    );

    user.password = undefined;

    res.status(200).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
});

exports.signout = catchAsync(async (req, res, next) => {
    res.clearCookie("token");

    res.status(200).json({
        status: "success",
        message: "User successfully signed out.",
    });
});
