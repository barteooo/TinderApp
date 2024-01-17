import { useCallback, useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import UsersApi from "../../api/UsersApi";
import UserCard from "../../components/UserCard";

const UserMainPage = () => {
  const [interestUsers, setInterestUsers] = useState([]);

  const handleUserCardSwipe = async (dir, user) => {
    if (dir === "right") {
      await UsersApi.addMatch(user._id);
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
      <h1>Test</h1>
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
