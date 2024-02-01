const TinderCard = require("react-tinder-card");

const UserCard = ({ user, onSwipe }) => {
  return (
    <TinderCard className="swipe" onSwipe={(dir) => onSwipe(dir, user)}>
      <div
        className="card"
        style={{
          backgroundImage: `url(${user.images[0]})`,
        }}
      >
        <div className="usercard-info">
          <h3>{user.name}</h3>
          <p>{user.about}</p>
          {
            <ul>
              {user.interests.map((interest, index) => {
                return <li key={index}>{interest}</li>;
              })}
            </ul>
          }
        </div>
      </div>
    </TinderCard>
  );
};

export default UserCard;
