const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const authMiddleware = require("../middlewares/authMiddleware");
const config = require("../config");

const router = express.Router();

router.get("/one/:id", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { id } = req.params;

    await client.connect();
    const database = client.db(config.DARABASE_NAME);

    const user = await database
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      res.statusCode = 400;
      res.json({ message: "User with this id not exists" });
      return;
    }

    const userDTO = {
      _id: user._id,
      email: user.email,
    };

    res.json({ user: userDTO });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

module.exports = router;
