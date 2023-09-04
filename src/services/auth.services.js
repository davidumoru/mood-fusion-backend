const axios = require("axios");
const qs = require("querystring");

async function refreshAccessToken(refreshToken) {
  try {
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Check if the response contains the expected data
    if (!tokenResponse.data || !tokenResponse.data.access_token) {
      throw new Error("Invalid token response");
    }

    return {
      access_token: tokenResponse.data.access_token,
      expires_in: tokenResponse.data.expires_in,
    };
  } catch (error) {
    console.error("Failed to refresh access token:", error.message);
    return {
      success: false,
      message: "Failed to refresh access token",
      error: error.message,
    };
  }
}

module.exports = {
  refreshAccessToken,
};
