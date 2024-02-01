import { useCallback, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";

const UserPageLayout = () => {
  const { contextState, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const handleClickLogout = useCallback(() => {
    dispatch({ type: "CLEAR" });
    navigate("/logout");
  }, [navigate, dispatch]);

  return (
    <div>
      <nav className="navbar-nav">
        <ul className="navbar-nav-ul">
          <li className="navbar-caption-li">
            <p className="navbar-caption">
              {contextState.user.name} {contextState.user.surname}
            </p>
          </li>
          <li className="navlink-li">
            <Link to="/user">Main</Link>
          </li>
          <li className="navlink-li">
            <Link to="/user/edit">Edit</Link>
          </li>
          <li className="navlink-li"></li>
        </ul>
        <button className="secondary-button" onClick={handleClickLogout}>
          Logout
        </button>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default UserPageLayout;
