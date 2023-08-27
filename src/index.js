require("dotenv").config();
const express = require('express');
const app = express();

const spotifyAuthRoutes = require('./routes/auth.routes');
const connectDB = require("./configs/database");

connectDB(process.env.MONGO_URI);

app.use('/auth', spotifyAuthRoutes);

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
