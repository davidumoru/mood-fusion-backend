const playlistService = require('../services/playlist.services');

const createMoodBasedPlaylist = async (req, res) => {
  const { accessToken, userId, mood } = req.body;

  try {
    const playlistId = await playlistService.createMoodBasedPlaylist(accessToken, userId, mood);
    if (playlistId) {
      res.status(201).json({ playlistId });
    } else {
      res.status(400).json({ message: 'Failed to create playlist' });
    }
  } catch (error) {
    console.error('Error creating mood-based playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createSongBasedPlaylist = async (req, res) => {
  const { accessToken, userId, inputSongId } = req.body;

  try {
    const playlistId = await playlistService.createSongBasedPlaylist(accessToken, userId, inputSongId);
    if (playlistId) {
      res.status(201).json({ playlistId });
    } else {
      res.status(400).json({ message: 'Failed to create song-based playlist' });
    }
  } catch (error) {
    console.error('Error creating song-based playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createMoodBasedPlaylist, createSongBasedPlaylist
};
