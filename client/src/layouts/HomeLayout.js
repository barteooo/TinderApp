import { Link, Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="background">
      {/* <nav className="navbar-nav">
        <ul className="navbar-nav-ul">
          <li className="navlink-li">
            <Link to="/" style={{ marginRight: 5 }}>
              Home
            </Link>
          </li>
          <li className="navlink-li">
            <Link to="/login" style={{ marginRight: 5 }}>
              Login
            </Link>
          </li>
          <li className="navlink-li">
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav> */}
      <Outlet />
    </div>
  );
};

export default HomeLayout;
