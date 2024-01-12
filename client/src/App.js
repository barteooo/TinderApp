import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";

import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserEditPage from "./pages/UserPages/UserEditPage";
import TokenService from "./services/TokenService";
import AuthApi from "./api/AuthApi";
import UserPageLayout from "./layouts/UserPageLayout";

const nonauthLoader = async () => {
  if (TokenService.tokenExists() && (await AuthApi.checkAuth())) {
    return redirect("/user/edit");
  }
  return null;
};

const authLoader = async () => {
  if (!TokenService.tokenExists()) {
    return redirect("/login");
  }

  if (!(await AuthApi.checkAuth())) {
    return redirect("/login");
  }
  return null;
};

const logoutLoader = () => {
  TokenService.removeToken();
  return redirect("/");
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
    loader: nonauthLoader,
  },
  {
    path: "/login",
    Component: LoginPage,
    loader: nonauthLoader,
  },
  {
    path: "/register",
    Component: RegisterPage,
    loader: nonauthLoader,
  },
  {
    path: "/user",
    loader: authLoader,
    Component: UserPageLayout,
    children: [
      {
        path: "/user/edit",
        Component: UserEditPage,
      },
    ],
  },
  {
    path: "/logout",
    loader: logoutLoader,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
