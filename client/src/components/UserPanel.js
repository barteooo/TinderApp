import { useContext } from "react";
import UserPanelItem from "./UserPanelItem";
import AppContext from "../context/AppContext";

const UserPanel = () => {
  const { contextState } = useContext(AppContext);

  return (
    <div>
      <div>
        {contextState.user.name} {contextState.user.surname}
      </div>
      <div>
        {contextState.matchedUsers.map((user, index) => {
          return <UserPanelItem key={index} user={user} />;
        })}
      </div>
    </div>
  );
};

export default UserPanel;
