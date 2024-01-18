import { useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const UserPageLayout = () => {
  const navigate = useNavigate();

  const handleClickLogout = useCallback(() => {
    navigate("/logout");
  }, [navigate]);

  return (
    <div>
      <div>
        <nav>
          <Link style={{ marginRight: 20 }} to="/user">
            Main
          </Link>
          <Link to="/user/edit">Edit</Link>
        </nav>
        <button onClick={handleClickLogout}>Logout</button>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default UserPageLayout;
