require("dotenv").config();
const express = require('express');
const app = express();
const cors = require("cors")

const spotifyAuthRoutes = require('./routes/auth.routes');
const createPlaylistRoute = require('./routes/playlist.routes');
const connectDB = require("./configs/database");

app.use(cors());
connectDB(process.env.MONGO_URI);

app.use(express.json());


app.use('/auth', spotifyAuthRoutes);
app.use('/create-playlist', createPlaylistRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "I am running",
  });
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
