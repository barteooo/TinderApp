import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import AuthApi from "../../api/AuthApi";
import UsersApi from "../../api/UsersApi";
import TokenService from "../../services/TokenService";
import { useCallback, useContext } from "react";
import AppContext from "../../context/AppContext";
import { socket } from "../../socket";

const LoginForm = () => {
  const { dispatch } = useContext(AppContext);

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      const result = await AuthApi.signin(values);
      if (!result.success) {
        helpers.setErrors({ error: result.message });
        return;
      }

      TokenService.setToken(result.token);
      initLoginData();
      navigate("/user");
    },
  });

  const initLoginData = useCallback(async () => {
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

    socket.emit("user_data", { userId: userResult.user.id });
  }, [dispatch]);

  const handleClickNavToRegister = useCallback(() => {
    navigate("/register");
  }, [navigate]);

  return (
    <div className="form-container">
      <h1 className="form-caption">Login</h1>
      <form className="form" onSubmit={formik.handleSubmit}>
        <div className="form-item form-item-row">
          <input
            placeholder="Email..."
            className="input"
            name="email"
            type="email"
            {...formik.getFieldProps("email")}
          />
        </div>
        {formik.touched.email && formik.errors.email ? (
          <div className="form-alert form-alert-danger">
            {formik.errors.email}
          </div>
        ) : null}
        <div className="form-item form-item-row">
          <input
            className="input"
            placeholder="Password..."
            name="password"
            type="password"
            {...formik.getFieldProps("password")}
          />
        </div>
        {formik.touched.password && formik.errors.password ? (
          <div className="form-alert form-alert-danger">
            {formik.errors.password}
          </div>
        ) : null}
        <div className="form-item form-item-center">
          <button className="primary-button" type="submit">
            Login
          </button>
        </div>

        {formik.errors.error ? (
          <div className="form-alert form-alert-danger">
            {formik.errors.error}
          </div>
        ) : null}
      </form>
      <div className="form-item form-item-center">
        <button className="primary-button" onClick={handleClickNavToRegister}>
          Register
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
