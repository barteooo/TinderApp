import UserDeleteMatch from "../User/UserDeleteMatch";
import MessagesStats from "./MessagesStats";

const MatchedUserInfo = ({ userData, handleClickDeleteMatch }) => {
  return (
    <div>
      <img
        style={{ width: 100, height: "auto" }}
        src={userData?.images?.[0]}
        alt="user"
      />
      <h2>
        {userData.name} {userData.surname}
      </h2>
      <UserDeleteMatch handleClickDeleteMatch={handleClickDeleteMatch} />
      <MessagesStats matchedUserId={userData._id} />
    </div>
  );
};

export default MatchedUserInfo;
