import { useCallback, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";

const UserPageLayout = () => {
  const { disptach } = useContext(AppContext);
  const navigate = useNavigate();

  const handleClickLogout = useCallback(() => {
    disptach({ type: "CLEAR" });
    navigate("/logout");
  }, [navigate, disptach]);

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
