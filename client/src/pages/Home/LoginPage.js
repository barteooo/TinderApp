import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import AuthApi from "../../api/AuthApi";
import UsersApi from "../../api/UsersApi";
import TokenService from "../../services/TokenService";
import { useCallback, useContext } from "react";
import AppContext from "../../context/AppContext";
import { socket } from "../../socket";
import LoginForm from "../../components/Home/LoginForm";

const LoginPage = () => {
  return (
    <div>
      <h1>Login page</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
