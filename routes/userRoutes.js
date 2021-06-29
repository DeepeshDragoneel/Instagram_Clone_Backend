const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/signIn", authController.postSingIn);

router.get("/verifySignUp/:token", authController.postVerifySignUp);

router.post("/signUp", authController.postSignUp);

router.get("/", authController.home);

module.exports = router;