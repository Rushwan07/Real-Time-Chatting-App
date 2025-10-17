const Message = require("../models/messageModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// 📩 1️⃣ Send a new message
exports.sendMessage = catchAsync(async (req, res, next) => {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
        return next(new AppError("Please provide sender, receiver, and message", 400));
    }

    // Ensure both users exist
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
        return next(new AppError("Sender or receiver not found", 404));
    }

    // Create message
    const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        message,
    });

    res.status(201).json({
        status: "success",
        data: {
            message: newMessage,
        },
    });
});

// 💬 2️⃣ Get chat history between two users
exports.getMessages = catchAsync(async (req, res, next) => {
    const { userId1, userId2 } = req.params;

    if (!userId1 || !userId2) {
        return next(new AppError("Please provide both user IDs", 400));
    }

    const messages = await Message.find({
        $or: [
            { sender: userId1, receiver: userId2 },
            { sender: userId2, receiver: userId1 },
        ],
    })
        .sort({ createdAt: 1 }) // oldest to newest
        .populate("sender", "username image")
        .populate("receiver", "username image");

    res.status(200).json({
        status: "success",
        results: messages.length,
        data: {
            messages,
        },
    });
});

exports.markAsSeen = catchAsync(async (req, res, next) => {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
        return next(new AppError("Please provide sender and receiver IDs", 400));
    }

    await Message.updateMany(
        { sender: senderId, receiver: receiverId, status: { $ne: "seen" } },
        { $set: { status: "seen" } }
    );

    res.status(200).json({
        status: "success",
        message: "Messages marked as seen",
    });
});
