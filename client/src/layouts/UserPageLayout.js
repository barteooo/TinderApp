import { useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const UserPageLayout = () => {
  const navigate = useNavigate();

  const handleClickLogout = useCallback(() => {
    navigate("/logout");
  }, [navigate]);

  return (
    <div>
      <div>
        <button onClick={handleClickLogout}>Logout</button>
      </div>
      <div style={{ border: "1px solid red" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default UserPageLayout;
