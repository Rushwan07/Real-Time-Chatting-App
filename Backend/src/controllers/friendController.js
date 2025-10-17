const User = require("../models/userModel");

// ✅ Send Friend Request
exports.sendFriendRequest = async (req, res) => {
    try {
        const { id: senderId } = req.user; // assume you have user auth middleware
        const { receiverId } = req.params;

        if (senderId === receiverId)
            return res.status(400).json({ message: "You cannot send a request to yourself." });

        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        if (!receiver) return res.status(404).json({ message: "User not found." });

        // check if already friends
        if (sender.friends.includes(receiverId))
            return res.status(400).json({ message: "Already friends." });

        // check if already sent
        const alreadySent = receiver.friendRequests.find(
            (req) => req.from.toString() === senderId
        );
        if (alreadySent)
            return res.status(400).json({ message: "Friend request already sent." });

        // push new request
        receiver.friendRequests.push({ from: senderId });
        await receiver.save();

        res.status(200).json({ message: "Friend request sent successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Accept Friend Request
exports.acceptFriendRequest = async (req, res) => {
    try {
        const { id: receiverId } = req.user;
        const { senderId } = req.params;

        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        const request = receiver.friendRequests.find(
            (req) => req.from.toString() === senderId && req.status === "pending"
        );
        if (!request) return res.status(400).json({ message: "No pending request found." });

        // update status
        request.status = "accepted";

        // add to friends list
        receiver.friends.push(senderId);
        sender.friends.push(receiverId);

        await receiver.save();
        await sender.save();

        res.status(200).json({ message: "Friend request accepted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Reject Friend Request
exports.rejectFriendRequest = async (req, res) => {
    try {
        const { id: receiverId } = req.user;
        const { senderId } = req.params;

        const receiver = await User.findById(receiverId);
        const request = receiver.friendRequests.find(
            (req) => req.from.toString() === senderId && req.status === "pending"
        );

        if (!request)
            return res.status(400).json({ message: "No pending request found." });

        request.status = "rejected";
        await receiver.save();

        res.status(200).json({ message: "Friend request rejected." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Remove Friend
exports.removeFriend = async (req, res) => {
    try {
        const { id: userId } = req.user;
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
