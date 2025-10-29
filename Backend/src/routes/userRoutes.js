const express = require("express");
const userController = require("../controllers/usersController");
const { verifyToken } = require("../utils/verifyToken");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.get('/verify/:token', userController.verifyEmail);
router.get("/signout", userController.signout);
router.patch("/updateProfile", verifyToken, userController.editUser);
router.get("/search", verifyToken, userController.searchUsers);
router.get("/getuser/:id", verifyToken, userController.getuser);

module.exports = router; 
