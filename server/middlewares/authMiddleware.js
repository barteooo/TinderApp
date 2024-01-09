const jwt = require("jsonwebtoken");
const config = require("../config");

const authMiddleware = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader) {
    res.sendStatus(401);
    return;
  }

  const token = bearerHeader.replace("Bearer ", "");
  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    jwt.verify(token, config.SECRET_KEY);
  } catch {
    res.sendStatus(401);
    return;
  }

  next();
};

module.exports = authMiddleware;
