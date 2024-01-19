import { useContext, useEffect, useState } from "react";
import UsersApi from "../../api/UsersApi";
import UserCard from "../../components/UserCard";
import UserPanel from "../../components/UserPanel";
import AppContext from "../../context/AppContext";

const UserMainPage = () => {
  const { dispatch } = useContext(AppContext);

  const [interestUsers, setInterestUsers] = useState([]);

  const handleUserCardSwipe = async (dir, user) => {
    if (dir === "right") {
      const result = await UsersApi.addMatch(user._id);
      if (result.isMatch) {
        const matchedResult = await UsersApi.getMatchedUsers();
        if (!matchedResult.success) {
          alert("Error getMatchedUsers");
          return;
        }

        dispatch({ type: "SET_MATCHED_USERS", payload: matchedResult.users });
        alert("MATCH");
      }
    } else {
      await UsersApi.addNotMatch(user._id);
    }
  };

  useEffect(() => {
    const getInterestUsers = async () => {
      const result = await UsersApi.getInterestUsers();
      if (!result.success) {
        alert("Błąd!");
        return;
      }

      setInterestUsers([...result.users]);
    };

    getInterestUsers();
  }, []);

  return (
    <div>
      <UserPanel />
      <div className="swipe-container">
        <div className="card-container">
          {interestUsers.map((user, index) => {
            return (
              <UserCard key={index} user={user} onSwipe={handleUserCardSwipe} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserMainPage;
