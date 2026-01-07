const User = require("../models/userModel");
const Notification = require("../models/notificationModel")

// ✅ Send Friend Request
exports.sendFriendRequest = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId } = req.params;


        if (senderId === receiverId)
            return res.status(400).json({ message: "You cannot send a request to yourself." });

        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        if (!receiver) return res.status(404).json({ message: "User not found." });

        // already friends?
        if (sender.friends.includes(receiverId))
            return res.status(400).json({ message: "Already friends." });

        // already sent?
        const alreadySent = receiver.friendRequests.find(
            (req) => req.from.toString() === senderId && req.status === "pending"
        );

        if (alreadySent)
            return res.status(400).json({ message: "Friend request already sent." });

        receiver.friendRequests.push({ from: senderId, status: "pending" });
        await receiver.save();

        await Notification.create({
            user: receiverId,
            fromUser: senderId,
            type: "REQUEST_SENT",
            isRead: false,
        });

        res.status(200).json({ message: "Friend request sent successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Accept Friend Request
exports.acceptFriendRequest = async (req, res) => {
    try {
        const receiverId = req.user.id;
        const { senderId } = req.params;
        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);
        const request = receiver.friendRequests.find(
            (req) => req.from.toString() === senderId && req.status === "pending"
        );
        console.log("2")

        if (!request) return res.status(400).json({ message: "No pending request found." });
        console.log("3")

        request.status = "accepted";
        receiver.friends.push(senderId);
        sender.friends.push(receiverId);
        console.log("4")


        await receiver.save();
        await sender.save();

        await Notification.create({
            user: senderId,
            fromUser: receiverId,
            type: "REQUEST_ACCEPTED",
            isRead: false,
        });

        res.status(200).json({
            message: "Friend request accepted.",
            data: {
                sender,
                receiver
            },
        });
    } catch (error) {
        console.log("error message", error.message)
        res.status(500).json({ message: error.message });
    }
};

// ✅ Reject Friend Request
exports.rejectFriendRequest = async (req, res) => {
    try {
        const receiverId = req.user.id;
        const { senderId } = req.params;

        const receiver = await User.findById(receiverId);
        const request = receiver.friendRequests.find(
            (req) => req.from.toString() === senderId && req.status === "pending"
        );

        if (!request)
            return res.status(400).json({ message: "No pending request found." });

        request.status = "rejected";
        await receiver.save();

        await Notification.create({
            user: receiverId,
            fromUser: senderId,
            type: "REQUEST_REJECTED",
            isRead: false,
        });

        res.status(200).json({ message: "Friend request rejected." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Remove Friend
exports.removeFriend = async (req, res) => {
    try {
        const userId = req.user.id;
        const { friendId } = req.params;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend)
            return res.status(404).json({ message: "User not found." });

        user.friends = user.friends.filter((id) => id.toString() !== friendId);
        friend.friends = friend.friends.filter((id) => id.toString() !== userId);

        await user.save();
        await friend.save();

        res.status(200).json({ message: "Friend removed successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get Friends List
exports.getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: "friends",
                select: "-password -__v",
            });


        if (!user) return res.status(404).json({ message: "User not found." });

        res.status(200).json({
            message: "Friends list fetched successfully.",
            friends: user.friends
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get Pending Friend Requests
exports.getFriendRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate("friendRequests.from", "username email image")
            .select("friendRequests");
        user.friendRequests = user.friendRequests.reverse();

        await Notification.updateMany(
            { user: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );

        // const notifications = await Notification.find({
        //     user: req.user.id
        // }).sort({ createdAt: -1 });

        if (!user) return res.status(404).json({ message: "User not found." });

        // const pending = user.friendRequests.filter((req) => req.status === "pending");

        res.status(200).json({
            message: "Pending requests fetched successfully.",
            requests: user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user.id,
            isRead: false
        }).sort({ createdAt: -1 });

        res.status(200).json({
            notify: notifications.length > 0,
            count: notifications.length,
            notifications
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
