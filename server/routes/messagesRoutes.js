const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const authMiddleware = require("../middlewares/authMiddleware");
const config = require("../config");

const router = express.Router();

router.get("/matched/:id", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { id } = req.params;

    await client.connect();
    const messagesCollection = client
      .db(config.DATABASE_NAME)
      .collection("messages");

    const chatData = await messagesCollection.findOne({
      $and: [
        { usersIds: { $in: [req.user._id] } },
        { usersIds: { $in: [new ObjectId(id)] } },
      ],
    });

    res.json({ messages: chatData.messages });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

module.exports = router;
