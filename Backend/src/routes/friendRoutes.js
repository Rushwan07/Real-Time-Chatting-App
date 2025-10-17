const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");

router.post("/request/:receiverId", friendController.sendFriendRequest);
router.post("/accept/:senderId", friendController.acceptFriendRequest);
router.post("/reject/:senderId", friendController.rejectFriendRequest);
router.delete("/remove/:friendId", friendController.removeFriend);

module.exports = router;
