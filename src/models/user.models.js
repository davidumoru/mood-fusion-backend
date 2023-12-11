const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  spotifyId: String,
  accessToken: String,
  refreshToken: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
