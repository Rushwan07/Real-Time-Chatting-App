const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");
const { verifyToken } = require("../utils/verifyToken");


router.post("/request/:receiverId", verifyToken, friendController.sendFriendRequest);
router.post("/accept/:senderId", verifyToken, friendController.acceptFriendRequest);
router.post("/reject/:senderId", verifyToken, friendController.rejectFriendRequest);
router.delete("/remove/:friendId", verifyToken, friendController.removeFriend);

module.exports = router;
