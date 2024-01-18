import { useEffect, useState } from "react";
import UsersApi from "../api/UsersApi";
import UserPanelItem from "./UserPanelItem";

const UserPanel = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);

  useEffect(() => {
    const getgetMatchesUsers = async () => {
      const result = await UsersApi.getMatchedUsers();
      if (!result.success) {
        alert("Error");
        return;
      }

      setMatchedUsers([...result.users]);
    };

    getgetMatchesUsers();
  }, []);

  return (
    <div>
      <div>{/* Informacje o nas */}</div>
      <div>
        {matchedUsers.map((user, index) => {
          return <UserPanelItem key={index} user={user} />;
        })}
      </div>
    </div>
  );
};

export default UserPanel;
