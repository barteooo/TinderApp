const PORT = 3001;
const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const { MongoClient } = require("mongodb");
const { ValidationError } = require("express-validation");
const config = require("./config");
const sockets = require("./sockets");

const app = express();

const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// Routers
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const usersRoutes = require("./routes/usersRoutes");
app.use("/api/users", usersRoutes);

const messagesRoutes = require("./routes/messagesRoutes");
app.use("/api/messages", messagesRoutes);

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    let message = "";
    if (err.details.body?.length > 0) {
      message = err.details.body.map((x) => x.message).join(";");
    }

    if (err.details.query?.length > 0) {
      message = err.details.query.map((x) => x.message).join(";");
    }
    res.status(err.statusCode).json({ err });
    return;
  }
  return res.status(500).json({ message: err.toString() });
});

sockets(server);

const mongoClient = new MongoClient(config.DATABASE_URL);

mongoClient.connect().then(() => {
  server.listen(PORT, () => {
    console.log("serwer 3001");
  });
});
