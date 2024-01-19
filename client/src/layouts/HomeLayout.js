import { Link, Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div>
      <nav>
        <Link to="/" style={{ marginRight: 5 }}>
          Home
        </Link>
        <Link to="/login" style={{ marginRight: 5 }}>
          Login
        </Link>
        <Link to="/register">Register</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default HomeLayout;
