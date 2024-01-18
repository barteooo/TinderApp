import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import UsersApi from "../../api/UsersApi";

const UserChatPage = () => {
  const [userData, setUserData] = useState({});
  const [messages, setMessages] = useState([]);

  const naviagte = useNavigate();
  const params = useParams();

  useEffect(() => {
    const getUserData = async () => {
      const result = await UsersApi.getOne(params.id);
      if (!result.success) {
        alert("Request error");
        return;
      }

      setUserData({
        ...result.user,
      });
    };

    getUserData();
  }, [params]);

  const handleClickDeleteMatch = useCallback(async () => {
    const result = await UsersApi.deleteMatch(userData._id);
    if (!result.success) {
      alert("Request error!");
      return;
    }

    naviagte("/user/");
  }, [userData, naviagte]);

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
        <div>{}</div>
        <div>
          <textarea></textarea>
          <button>Send</button>
        </div>
      </div>
    </div>
  );
};

export default UserChatPage;
