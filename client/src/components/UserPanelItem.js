const UserPanelItem = ({ user }) => {
  return (
    <div>
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
