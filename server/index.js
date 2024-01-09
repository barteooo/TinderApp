const PORT = 3001;
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { MongoClient } = require("mongodb");
const config = require("./config");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// Routers
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const usersRoutes = require("./routes/usersRoutes");
app.use("/api/users", usersRoutes);

const mongoClient = new MongoClient(config.DATABASE_URL);

mongoClient.connect().then(() => {
  app.listen(PORT, () => {
    console.log("serwer 3001");
  });
});
