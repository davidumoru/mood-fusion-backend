require("dotenv").config();
const express = require('express');
const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;

router.get('/login', (req, res) => {
  const scopes = ['user-read-private', 'user-read-email'];
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scopes.join('%20')}`;
  res.redirect(authUrl);
});

module.exports = router;
