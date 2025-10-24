const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const dotenv = require("dotenv");
const nodemailer = require('nodemailer');

dotenv.config();

const createToken = (userId, email) => {
    return jwt.sign(
        { id: userId, email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.LOGIN_EXPIRES }
    );
};

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

exports.signup = catchAsync(async (req, res, next) => {
    const { email, username, password, image } = req.body;

    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser) {
        let message =
            existingUser.email === email
                ? "Email is already registered"
                : "Username is already taken";
        return next(new AppError(message, 400));
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
        email,
        username,
        password: hashedPassword,
        image,
    });

    const token = createToken(newUser._id, newUser.email);

    const url = `http://localhost:5173/verify/${token}`;
    await transporter.sendMail({
        to: email,
        subject: 'Hello from ChitChat, Verify Your Email',
        html: `Click <a href="${url}">here</a> to verify your email.`,
    });

    newUser.password = undefined;

    res.status(201).json({
        status: "success",
        data: { user: newUser },
        token: "bearer " + token,

    });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ error: 'Invalid token or user does not exist.' });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({
            status: "success",
            data: { user },
            token: "bearer " + token,

        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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

    user.isOnline = true;
    await user.save({ validateBeforeSave: false });

    const token = createToken(user._id, user.email);

    user.password = undefined;


    res.status(200).json({
        status: "success",
        token,
        data: { user },
        token: "bearer " + token,
    });
});


exports.signout = catchAsync(async (req, res, next) => {
    console.log("USer", req.user)
    if (req.user) {
        await User.findByIdAndUpdate(req.user.id, { isOnline: false });
    }


    res.clearCookie("token");

    res.status(200).json({
        status: "success",
        message: "User successfully signed out.",
    });
});


exports.editUser = catchAsync(async (req, res, next) => {
    const { image } = req.body;

    if (!image) {
        return next(new AppError("Please provide an image URL", 400));
    }

    const user = await User.findById(req.user.id);


    if (!user) {
        return next(new AppError("User not found", 404));
    }

    user.image = image;
    await user.save();

    res.status(200).json({
        status: "success",
        message: "Profile image updated successfully",
        data: {
            user,
        },
    });
});



