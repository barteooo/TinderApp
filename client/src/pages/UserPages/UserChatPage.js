import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import UsersApi from "../../api/UsersApi";
import AppContext from "../../context/AppContext";
import MessagesApi from "../../api/MessagesApi";
import { socket } from "../../socket";

const UserChatPage = () => {
  const [messageText, setMessageText] = useState("");
  const { dispatch, contextState } = useContext(AppContext);
  const [userData, setUserData] = useState({});
  const [chatId, setChatId] = useState("");
  const [messages, setMessages] = useState([]);
  const [editMessageData, setEditMessageData] = useState({
    text: "",
    messageId: "",
  });
  const [stats, setStats] = useState({
    numberOfMessagesLastDay: 0,
  });

  const naviagte = useNavigate();
  const params = useParams();

  useEffect(() => {
    initData();
  }, [params]);

  const initData = useCallback(async () => {
    const matchedUser = contextState.matchedUsers?.find(
      (x) => x._id === params.id
    );

    if (!matchedUser) {
      return;
    }

    setUserData({ ...matchedUser });

    const result = await MessagesApi.getMessages(matchedUser._id);
    if (!result.success) {
      alert("Error getMessages");
      return;
    }

    setChatId(result.chatData._id);
    setMessages([...result.chatData.messages]);

    const statsResult = await MessagesApi.getStats(params.id);
    if (!statsResult.success) {
      alert("Error getStats");
      return;
    }

    setStats({
      ...stats,
      numberOfMessagesLastDay: statsResult.stats.numberOfMessagesLastDay,
    });
  }, [contextState.matchedUsers, params.id]);

  useEffect(() => {
    socket.on("message", onMessage);

    return () => {
      socket.off("message", onMessage);
    };
  }, []);

  const onMessage = (data) => {
    console.log("message", data);
    setMessages((s) => [...s, data]);
  };

  const handleClickDeleteMatch = useCallback(async () => {
    const result = await UsersApi.deleteMatch(userData._id);
    if (!result.success) {
      alert("Request error!");
      return;
    }

    const matchedResult = await UsersApi.getMatchedUsers();
    if (!matchedResult) {
      alert("Error getMatchedUsers");
      return;
    }

    dispatch({ type: "SET_MATCHED_USERS", payload: matchedResult.users });

    naviagte("/user/");
  }, [userData, naviagte, dispatch]);

  const handleClickSend = useCallback(() => {
    if (!messageText) {
      return;
    }

    const messageData = {
      date: new Date().toISOString(),
      text: messageText,
      userId: "",
    };
    setMessages([...messages, messageData]);

    socket.emit("message", { to: userData._id, text: messageText });
  }, [messageText, userData, messages]);

  const handleClickEditMessage = useCallback((messageId, text) => {
    setEditMessageData({
      messageId,
      text,
    });
  }, []);

  const handleClickDeleteMessage = useCallback(
    async (messageId) => {
      const result = await MessagesApi.deleteMessage(chatId, messageId);
      if (!result.success) {
        alert("Błąd usuwania wiadomości");
      }

      initData();
    },
    [chatId, initData]
  );

  const handleClickSaveMessage = useCallback(async () => {
    const result = await MessagesApi.updateMessage(
      chatId,
      editMessageData.messageId,
      editMessageData.text
    );
    if (!result.success) {
      alert("Błąd edycji wiadomości");
    }

    await initData();

    setEditMessageData({
      messageId: "",
      text: "",
    });
  }, [chatId, editMessageData, initData]);

  const handleClickDiscardEditMessage = useCallback(() => {
    setEditMessageData({
      messageId: "",
      text: "",
    });
  }, []);

  return (
    <div>
      <div>
        <img
          style={{ width: 100, height: "auto" }}
          src={userData?.images?.[0]}
          alt="user"
        />
        <h2>
          {userData.name} {userData.surname}
        </h2>
        <button onClick={handleClickDeleteMatch}>Delete</button>
      </div>

      <div>Number of messages last 24h: {stats.numberOfMessagesLastDay}</div>

      <div>
        <p>Messages</p>
        <div style={{ width: 300 }}>
          {messages.map((message, index) => {
            if (message.userId === userData._id) {
              return (
                <div
                  key={index}
                  style={{ textAlign: "left", backgroundColor: "silver" }}
                >
                  <h6>{message.date}</h6>
                  <p>{message.text}</p>
                </div>
              );
            } else if (editMessageData.messageId === message._id) {
              return (
                <div key={index} style={{ textAlign: "right" }}>
                  <h6>{message.date}</h6>
                  <textarea
                    value={editMessageData.text}
                    onChange={(e) =>
                      setEditMessageData({
                        ...editMessageData,
                        text: e.target.value,
                      })
                    }
                  ></textarea>
                  <div>
                    <button onClick={handleClickSaveMessage}>Save</button>
                    <button onClick={handleClickDiscardEditMessage}>
                      Discard
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={index} style={{ textAlign: "right" }}>
                <h6>{message.date}</h6>
                <p>{message.text}</p>
                <div>
                  <button
                    onClick={() =>
                      handleClickEditMessage(message._id, message.text)
                    }
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleClickDeleteMessage(message._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          ></textarea>
          <button onClick={handleClickSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default UserChatPage;
