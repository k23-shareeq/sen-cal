const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");
const { createUserProfileValidator } = require("../validators/userValidator");

// Get user profile details
router.get("/profile", authenticateToken, userController.getUserProfileDetails);

// Create user profile (with Joi validation)
router.post(
  "/profile",
  authenticateToken,
  createUserProfileValidator,
  userController.createUserProfile
);

module.exports = router;
