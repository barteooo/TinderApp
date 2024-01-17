import { useCallback } from "react";
import TinderCard from "react-tinder-card";

const UserMainPage = () => {
  const handleTinderCardSwipe = () => {
    console.log("Swipe");
  };

  const handleTinderCardLeft = () => {
    console.log("left");
  };

  const usersData = [
    {
      name: "Marek Mostowiak",
      url: "https://zloteprzeboje.pl/wp-content/uploads/2022/08/Marek-Mostowiak.png",
    },
    {
      name: "Elon Musk",
      url: "https://zloteprzeboje.pl/wp-content/uploads/2022/08/Marek-Mostowiak.png",
    },
    {
      name: "Jeff Bezos",
      url: "https://zloteprzeboje.pl/wp-content/uploads/2022/08/Marek-Mostowiak.png",
    },
  ];

  return (
    <div>
      <h1>Test</h1>
      <div className="swipe-container">
        <div className="card-container">
          {usersData.map((user, index) => {
            return (
              <TinderCard
                key={index}
                className="swipe"
                onSwipe={(dir) => {
                  console.log(dir);
                }}
                onCardLeftScreen={() => {
                  // console.log("card left screen");
                }}
              >
                <div
                  style={{
                    backgroundImage: `url(${user.url})`,
                  }}
                  className="card"
                >
                  <h3>{user.name}</h3>
                </div>
              </TinderCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserMainPage;
