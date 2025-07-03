const userService = require("../services/userService");

// Get user profile details
exports.getUserProfileDetails = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const profile = await userService.getUserProfileDetails(userId);
  if (!profile) {
    return res.status(404).json({ message: "User profile not found" });
  }
  res.json(profile);
};

// Create user profile
exports.createUserProfile = async (req, res) => {
  const userId = req.user.id;
  const profileData = req.body;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const newProfile = await userService.createUserProfile({...profileData, user_id: userId});
  res.status(201).json(newProfile);
};
