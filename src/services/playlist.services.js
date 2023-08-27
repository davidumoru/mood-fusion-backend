const axios = require("axios");

const createMoodBasedPlaylist = async (accessToken, userId, mood) => {
  try {
    const playlistResponse = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: `Mood Fusion: ${mood}`,
        description: `Mood Fusion playlist based on ${mood}`,
        public: false,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response contains the expected data
    if (!playlistResponse.data || !playlistResponse.data.id) {
      throw new Error("Invalid playlist response");
    }

    const playlistId = playlistResponse.data.id;

    const trackResponse = await axios.get(
      `https://api.spotify.com/v1/search?q=${mood}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response contains the expected data
    if (
      !trackResponse.data ||
      !trackResponse.data.tracks ||
      !trackResponse.data.tracks.items
    ) {
      throw new Error("Invalid track response");
    }

    const tracks = trackResponse.data.tracks.items.map((item) => item.uri);

    const addTracksResponse = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: tracks,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response contains the expected data
    if (!addTracksResponse.data || !addTracksResponse.data.snapshot_id) {
      throw new Error("Invalid add tracks response");
    }

    return playlistId;
  } catch (error) {
    console.error("Failed to create playlist:", error.message);
    return {
      success: false,
      message: "Failed to create playlist",
      error: error.message,
    };
  }
};

module.exports = {
  createMoodBasedPlaylist,
};
