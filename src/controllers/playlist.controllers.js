const playlistService = require("../services/playlist.services");

const createMoodBasedPlaylist = async (req, res) => {
  const { accessToken, userId, mood } = req.body;

  // Input validation for required fields
  if (!accessToken || !userId || !mood) {
    return res.status(400).json({ message: 'Invalid input. Please provide access token, user ID, and mood.' });
  }

  try {
    const playlistId = await playlistService.createMoodBasedPlaylist(
      accessToken,
      userId,
      mood
    );
    if (playlistId) {
      res.status(201).json({ playlistId });
    } else {
      res
        .status(400)
        .json({
          message: "Failed to create playlist. Please check your inputs.",
        });
    }
  } catch (error) {
    console.error("Error creating mood-based playlist:", error);
    if (error.message === "Invalid access token") {
      res
        .status(401)
        .json({
          message: "Invalid access token. Please provide a valid access token.",
        });
    } else if (error.message === "Invalid user ID") {
      res
        .status(400)
        .json({ message: "Invalid user ID. Please provide a valid user ID." });
    } else {
      res
        .status(500)
        .json({ message: "Internal server error. Please try again later." });
    }
  }
};

const createSongBasedPlaylist = async (req, res) => {
  const { accessToken, userId, inputSongId } = req.body;

  // Input validation for required fields
  if (!accessToken || !userId || !inputSongId) {
    return res.status(400).json({ message: 'Invalid input. Please provide access token, user ID, and song ID.' });
  }

  try {
    const playlistId = await playlistService.createSongBasedPlaylist(
      accessToken,
      userId,
      inputSongId
    );
    if (playlistId) {
      res.status(201).json({ playlistId });
    } else {
      res
        .status(400)
        .json({
          message:
            "Failed to create song-based playlist. Please check your inputs.",
        });
    }
  } catch (error) {
    console.error("Error creating song-based playlist:", error);
    if (error.message === "Invalid access token") {
      res
        .status(401)
        .json({
          message: "Invalid access token. Please provide a valid access token.",
        });
    } else if (error.message === "Invalid user ID") {
      res
        .status(400)
        .json({ message: "Invalid user ID. Please provide a valid user ID." });
    } else {
      res
        .status(500)
        .json({ message: "Internal server error. Please try again later." });
    }
  }
};

const createArtistBasedPlaylist = async (req, res) => {
  const { accessToken, userId, artistId, includeRecommended } = req.body;

  // Input validation for required fields
  if (!accessToken || !userId || !artistId || !includeRecommended) {
    return res.status(400).json({ message: 'Invalid input. Please provide access token, user ID, artist ID and include recommended.' });
  }

  try {
    const playlistId = await playlistService.createArtistBasedPlaylist(
      accessToken,
      userId,
      artistId,
      includeRecommended
    );
    if (playlistId) {
      res.status(201).json({ playlistId });
    } else {
      res
        .status(400)
        .json({
          message:
            "Failed to create artist-based playlist. Please check your inputs.",
        });
    }
  } catch (error) {
    console.error("Error creating artist-based playlist:", error);
    if (error.message === "Invalid access token") {
      res
        .status(401)
        .json({
          message: "Invalid access token. Please provide a valid access token.",
        });
    } else if (error.message === "Invalid user ID") {
      res
        .status(400)
        .json({ message: "Invalid user ID. Please provide a valid user ID." });
    } else {
      res
        .status(500)
        .json({ message: "Internal server error. Please try again later." });
    }
  }
};

module.exports = {
  createMoodBasedPlaylist,
  createSongBasedPlaylist,
  createArtistBasedPlaylist,
};
