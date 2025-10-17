const express = require("express");
const messageController = require("../controllers/messageController");

const router = express.Router();

router.post("/send", messageController.sendMessage);
router.get("/:userId1/:userId2", messageController.getMessages);
router.patch("/seen", messageController.markAsSeen);

module.exports = router;
