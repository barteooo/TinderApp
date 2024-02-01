import { useNavigate } from "react-router-dom";

const UserPanelItem = ({ user }) => {
  const navigate = useNavigate();

  const handleClickMain = () => {
    navigate(`/user/chat/${user._id}`);
  };

  return (
    <div className="user-panel-item">
      <img
        className="user-panel-item-img"
        src={user.images[0]}
        alt="user"
        onClick={handleClickMain}
      />
      <p className="user-panel-item-caption">{user.name}</p>
    </div>
  );
};

export default UserPanelItem;
