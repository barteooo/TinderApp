import { useContext } from "react";
import UserPanelItem from "./UserPanelItem";
import appContext from "../../context/AppContext";

const UserPanel = () => {
  const { contextState } = useContext(appContext);

  return (
    <div className="user-panel-container">
      {contextState.matchedUsers.map((user, index) => {
        return <UserPanelItem key={index} user={user} />;
      })}
    </div>
  );
};

export default UserPanel;
