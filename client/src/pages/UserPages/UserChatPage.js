import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import UsersApi from "../../api/UsersApi";
import AppContext from "../../context/AppContext";
import MessagesApi from "../../api/MessagesApi";
import { socket } from "../../socket";
import MatchedUserInfo from "../../components/Messages/MatchedUserInfo";
import MessagesContainer from "../../components/Messages/MessagesContainer";

const UserChatPage = () => {
  const [messageText, setMessageText] = useState("");
  const { dispatch, contextState } = useContext(AppContext);
  const [userData, setUserData] = useState({});
  const [chatId, setChatId] = useState("");
  const [messages, setMessages] = useState([]);

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

    // const statsResult = await MessagesApi.getStats(params.id);
    // if (!statsResult.success) {
    //   alert("Error getStats");
    //   return;
    // }

    // setStats({
    //   ...stats,
    //   numberOfMessagesLastDay: statsResult.stats.numberOfMessagesLastDay,
    // });
  }, [contextState.matchedUsers, params.id]);

  useEffect(() => {
    socket.on("message", onMessage);

    return () => {
      socket.off("message", onMessage);
    };
  }, []);

  const onMessage = (data) => {
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

  return (
    <div>
      <MatchedUserInfo
        userData={userData}
        handleClickDeleteMatch={handleClickDeleteMatch}
      />
      <div>
        <p>Messages</p>
        <MessagesContainer
          chatId={chatId}
          userData={userData}
          messages={messages}
          refreshData={initData}
        />
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
