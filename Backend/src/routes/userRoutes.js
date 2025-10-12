const express = require("express");
const userController = require("../controllers/usersController");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.get("/signout", userController.signout);

module.exports = router; // ✅ export the router directly
