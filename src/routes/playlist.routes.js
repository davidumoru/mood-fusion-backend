const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlist.controllers");

router.post("/mood", playlistController.createMoodBasedPlaylist);
router.post("/song", playlistController.createSongBasedPlaylist);
router.post("/artist", playlistController.createArtistBasedPlaylist);

module.exports = router;
