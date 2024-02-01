import UserDeleteMatch from "../User/UserDeleteMatch";
import MessagesStats from "./MessagesStats";

const MatchedUserInfo = ({ userData, handleClickDeleteMatch, messages }) => {
  return (
    <div>
      <div className="matched-user-info">
        <div className="user-panel-item">
          <img
            className="user-panel-item-img"
            src={userData?.images?.[0]}
            alt="user"
          />
          <p className="user-panel-item-caption">
            {userData?.name} {userData?.surname}
          </p>
          <UserDeleteMatch handleClickDeleteMatch={handleClickDeleteMatch} />
        </div>
      </div>
      <MessagesStats matchedUserId={userData?._id} messages={messages} />
    </div>
  );
};

export default MatchedUserInfo;
