import { useNavigate } from "react-router-dom";

const UserPanelItem = ({ user }) => {
  const navigate = useNavigate();

  const handleClickMain = () => {
    navigate(`/user/chat/${user._id}`);
  };

  return (
    <div onClick={handleClickMain}>
      <img
        style={{ width: 100, height: "auto" }}
        src={user.images[0]}
        alt="user"
      />
      <p>{user.name}</p>
    </div>
  );
};

export default UserPanelItem;
