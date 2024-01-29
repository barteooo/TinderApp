const { MongoClient, ObjectId } = require("mongodb");
const { Server } = require("socket.io");
const config = require("./config");

const userIdsPerSockets = [{ socket: "", userId: "" }];

const sockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("connected");

    socket.on("user_data", (data) => {
      const userIdPerSocket = {
        socket,
        userId: data.userId,
      };
      userIdsPerSockets.push(userIdPerSocket);
    });

    socket.on("message", async (messageData) => {
      const reciverSocket = userIdsPerSockets.find(
        (x) => x.userId == messageData.to
      )?.socket;

      const senderUserId = userIdsPerSockets.find(
        (x) => x.socket == socket
      )?.userId;

      const message = {
        _id: new ObjectId(),
        date: new Date(),
        text: messageData.text,
        userId: senderUserId,
      };

      if (reciverSocket) {
        reciverSocket.emit("message", message);
      }

      const client = new MongoClient(config.DATABASE_URL);
      const messagesCollection = client
        .db(config.DATABASE_NAME)
        .collection("messages");

      const chatData = await messagesCollection.findOne({
        $and: [
          { usersIds: { $in: [new ObjectId(messageData.to)] } },
          { usersIds: { $in: [new ObjectId(senderUserId)] } },
        ],
      });

      messagesCollection.updateOne(
        { _id: chatData._id },
        {
          $set: {
            messages: [...chatData.messages, message],
          },
        }
      );
    });

    socket.on("logout", () => {
      console.log("logout");
      const index = userIdsPerSockets.findIndex((x) => x.socket == socket);
      userIdsPerSockets.splice(index, 1);
    });

    socket.on("disconnect", () => {
      const index = userIdsPerSockets.findIndex((x) => x.socket == socket);
      userIdsPerSockets.splice(index, 1);
    });
  });
};

module.exports = sockets;
