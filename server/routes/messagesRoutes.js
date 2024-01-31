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

    res.json({ chatData });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.delete("/", (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  const { chatId, messageId } = req.body;

  return new Promise((resolve, reject) => {
    const messagesCollection = client
      .db(config.DATABASE_NAME)
      .collection("messages");

    messagesCollection.findOne({ _id: new ObjectId(chatId) }).then((chat) => {
      const updatedMessages = chat.messages.filter(
        (m) => m._id.toString() !== messageId
      );

      messagesCollection
        .updateOne(
          { _id: new ObjectId(chatId) },
          {
            $set: {
              messages: updatedMessages,
            },
          }
        )
        .then(() => {
          res.sendStatus(200);
          client.close().then(() => {
            resolve();
          });
        })
        .catch((error) => {
          res.sendStatus(500);
          console.error(error);
          client.close().then(() => {
            reject(error);
          });
        });
    });
  });
});

router.put("/", (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  const { chatId, messageId, text } = req.body;

  return new Promise((resolve, reject) => {
    const messagesCollection = client
      .db(config.DATABASE_NAME)
      .collection("messages");

    messagesCollection.findOne({ _id: new ObjectId(chatId) }).then((chat) => {
      const index = chat.messages.findIndex(
        (x) => x._id.toString() === messageId
      );
      if (index >= 0) {
        chat.messages[index].date = new Date();
        chat.messages[index].text = text;
      }

      messagesCollection
        .updateOne(
          { _id: new ObjectId(chatId) },
          {
            $set: {
              messages: [...chat.messages],
            },
          }
        )
        .then(() => {
          res.sendStatus(200);
          client.close().then(() => {
            resolve();
          });
        })
        .catch((error) => {
          res.sendStatus(500);
          console.error(error);
          client.close().then(() => {
            reject(error);
          });
        });
    });
  });
});

router.get("/stats/:userId", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);
  try {
    const { userId } = req.params;

    const messagesCollection = client
      .db(config.DATABASE_NAME)
      .collection("messages");

    const statsArray = await messagesCollection
      .aggregate([
        { $unwind: "$messages" },
        {
          $match: {
            usersIds: { $in: [req.user._id, new ObjectId(userId)] },
            "messages.date": {
              $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: null,
            numberOfMessagesLastDay: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const stats = {
      numberOfMessagesLastDay: statsArray[0].numberOfMessagesLastDay,
    };

    res.json({ stats });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

module.exports = router;
