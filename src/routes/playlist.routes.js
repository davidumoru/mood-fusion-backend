const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlist.controllers');

router.post('/mood', playlistController.createMoodBasedPlaylist);

module.exports = router;
