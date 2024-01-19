import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import UsersApi from "../../api/UsersApi";
import AppContext from "../../context/AppContext";
import MessagesApi from "../../api/MessagesApi";

const UserChatPage = () => {
  const { dispatch, contextState } = useContext(AppContext);
  const [userData, setUserData] = useState({});
  const [messages, setMessages] = useState([]);

  const naviagte = useNavigate();
  const params = useParams();

  useEffect(() => {
    const initData = async () => {
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

      setMessages([...result.messages]);
    };

    initData();
  }, [params]);

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
            }

            return (
              <div key={index} style={{ textAlign: "right" }}>
                <h6>{message.date}</h6>
                <p>{message.text}</p>
              </div>
            );
          })}
        </div>
        <div>
          <textarea></textarea>
          <button>Send</button>
        </div>
      </div>
    </div>
  );
};

export default UserChatPage;
