import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import AuthApi from "../api/AuthApi";
import UsersApi from "../api/UsersApi";
import TokenService from "../services/TokenService";
import { useCallback, useContext } from "react";
import AppContext from "../context/AppContext";

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

const LoginPage = () => {
  const { dispatch, contextState } = useContext(AppContext);

  const navigate = useNavigate();

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
      initDataInContext();
      navigate("/user");
    },
  });

  const initDataInContext = useCallback(async () => {
    const result = await UsersApi.getCurrentUser();
    if (!result.success) {
      return;
    }

    dispatch({ type: "SET_USER", payload: result.user });

    const matchedResult = await UsersApi.getMatchedUsers();
    if (!matchedResult) {
      alert("Error getMatchedUsers");
      return;
    }

    dispatch({ type: "SET_MATCHED_USERS", payload: matchedResult.users });
  }, [dispatch]);

  return (
    <div>
      <h1>Login page</h1>

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

export default LoginPage;
