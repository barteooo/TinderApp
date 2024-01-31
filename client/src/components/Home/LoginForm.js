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

  return (
    <div>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label>Email</label>
            <input
              name="email"
              type="email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email ? (
              <p>{formik.errors.email}</p>
            ) : null}
          </div>
          <div>
            <label>Password</label>
            <input
              name="password"
              type="password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password ? (
              <p>{formik.errors.password}</p>
            ) : null}
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
          {formik.errors.error ? <p>{formik.errors.error}</p> : null}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;