const axios = require("axios");
const refreshAccessToken = require("../services/auth.services");
const User = require("../models/user.models");

async function checkTokens(req, res, next) {
  try {
    const user = await User.findOne({ spotifyId: req.user.spotifyId });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const currentTime = Date.now() / 1000;

    // Check if the access token is still valid
    if (user.accessTokenExpiresAt > currentTime) {
      req.accessToken = user.accessToken;
      next();
    } else {
      // Access token has expired, refresh it using the refresh token
      const refreshResult = await refreshAccessToken(user.refreshToken);

      if (!refreshResult.success) {
        return res
          .status(401)
          .json({ message: "Failed to refresh access token" });
      }

      // Update the user's access token in the database
      user.accessToken = refreshResult.access_token;
      user.accessTokenExpiresAt = currentTime + refreshResult.expires_in;
      await user.save();

      req.accessToken = user.accessToken;
      next();
    }
  } catch (error) {
    console.error("Error checking tokens:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  checkTokens,
};
