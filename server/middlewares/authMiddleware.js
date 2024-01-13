const jwt = require("jsonwebtoken");
const config = require("../config");
const { MongoClient, ObjectId } = require("mongodb");

const authMiddleware = async (req, res, next) => {
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

  let tokenData;
  try {
    tokenData = jwt.verify(token, config.SECRET_KEY);
  } catch {
    res.sendStatus(401);
    return;
  }

  const client = new MongoClient(config.DATABASE_URL);
  const usersCollection = client.db(config.DATABASE_NAME).collection("users");
  req.user = await usersCollection.findOne({ _id: new ObjectId(tokenData.id) });

  await client.close();

  if (!req.user) {
    res.sendStatus(401);
    return;
  }

  next();
};

module.exports = authMiddleware;
