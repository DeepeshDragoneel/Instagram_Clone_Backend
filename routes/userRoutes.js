const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.post("/signIn", authController.postSingIn);

router.post("/auth", authController.postUserAuthenticated);

router.get("/verifySignUp/:token", authController.postVerifySignUp);

router.post("/signUp", authController.postSignUp);

router.post("/changeUserDetails", userController.postChangeUserDetails);

router.get("/getUserProfileDetails", userController.getUserProfileDetails);

router.get("/", authController.home);

module.exports = router;