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
import UserMainPage from "./pages/UserPages/UserMainPage";
import UserChatPage from "./pages/UserPages/UserChatPage";
import { useContext, useEffect } from "react";
import UsersApi from "./api/UsersApi";
import AppContext from "./context/AppContext";
import HomeLayout from "./layouts/HomeLayout";
import { socket } from "./socket";

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
  socket.emit("logout");
  return redirect("/");
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    loader: nonauthLoader,
    children: [
      {
        path: "/",
        Component: HomePage,
      },
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/register",
        Component: RegisterPage,
      },
    ],
  },
  {
    path: "/user",
    loader: authLoader,
    Component: UserPageLayout,
    children: [
      {
        path: "/user",
        Component: UserMainPage,
      },
      {
        path: "/user/edit",
        Component: UserEditPage,
      },
      {
        path: "/user/chat/:id",
        Component: UserChatPage,
      },
    ],
  },
  {
    path: "/logout",
    loader: logoutLoader,
  },
]);

const App = () => {
  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    const init = async () => {
      const userResult = await UsersApi.getCurrentUser();
      if (!userResult.success) {
        return;
      }

      dispatch({ type: "SET_USER", payload: userResult.user });

      const matchedResult = await UsersApi.getMatchedUsers();
      if (!matchedResult) {
        alert("Error getMatchedUsers");
        return;
      }

      dispatch({ type: "SET_MATCHED_USERS", payload: matchedResult.users });
    };

    init();
  }, []);

  useEffect(() => {
    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
    };
  }, []);

  const onConnect = async () => {
    console.log("connect");
    const userResult = await UsersApi.getCurrentUser();
    if (!userResult.success) {
      return;
    }

    socket.emit("user_data", { userId: userResult.user.id });
  };

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
