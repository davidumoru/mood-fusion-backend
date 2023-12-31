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

const createSongBasedPlaylist = async (accessToken, userId, inputSongId) => {
  try {
    // Get the audio features of the input song
    const audioFeaturesResponse = await axios.get(
      `https://api.spotify.com/v1/audio-features/${inputSongId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response contains the expected data
    if (!audioFeaturesResponse.data || !audioFeaturesResponse.data.id) {
      throw new Error("Invalid audio features response");
    }

    const inputAudioFeatures = audioFeaturesResponse.data;

    // Find similar songs based on audio features
    const similarTracksResponse = await axios.get(
      "https://api.spotify.com/v1/recommendations",
      {
        params: {
          seed_tracks: inputSongId,
          target_danceability: inputAudioFeatures.danceability,
          target_tempo: inputAudioFeatures.tempo,
          max_energy: inputAudioFeatures.energy,
          min_liveness: inputAudioFeatures.liveness,
          min_acousticness: inputAudioFeatures.acousticness,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response contains the expected data
    if (!similarTracksResponse.data || !similarTracksResponse.data.tracks) {
      throw new Error("Invalid similar tracks response");
    }

    const similarTracks = similarTracksResponse.data.tracks.map(
      (track) => track.uri
    );

    // Create a playlist with the name of the input song and description
    const playlistResponse = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: `Song-Based Playlist: ${inputSongId}`,
        description: `Playlist based on the song ${inputSongId} and its similar tracks`,
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

    // Add the similar tracks to the playlist
    const addTracksResponse = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: similarTracks,
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
    console.error("Failed to create song-based playlist:", error.message);
    return {
      success: false,
      message: "Failed to create song-based playlist",
      error: error.message,
    };
  }
};

const createArtistBasedPlaylist = async (
  accessToken,
  userId,
  artistId,
  includeRecommended
) => {
  try {
    // Get the top tracks of the artist
    const topTracksResponse = await axios.get(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response contains the expected data
    if (!topTracksResponse.data || !topTracksResponse.data.tracks) {
      throw new Error("Invalid top tracks response");
    }

    const topTracks = topTracksResponse.data.tracks.map((track) => track.uri);

    // Create a playlist with the name of the artist and description
    const playlistName = includeRecommended
      ? `Artist-Based Playlist with Recommendations: ${artistId}`
      : `Artist-Based Playlist: ${artistId}`;

    const playlistDescription = includeRecommended
      ? `Playlist based on the artist ${artistId}'s top tracks with additional recommendations`
      : `Playlist based on the artist ${artistId}'s top tracks`;

    const playlistResponse = await axios.post(
      `https://api.spotify.com/v1/${userId}/playlists`,
      {
        name: playlistName,
        description: playlistDescription,
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

    // Add the selected tracks to the playlist
    const tracksToAdd = includeRecommended ? topTracks : [];

    const addTracksResponse = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: tracksToAdd,
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
    console.error("Failed to create artist-based playlist:", error.message);
    return {
      success: false,
      message: "Failed to create artist-based playlist",
      error: error.message,
    };
  }
};

module.exports = {
  createMoodBasedPlaylist,
  createSongBasedPlaylist,
  createArtistBasedPlaylist,
};
