import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import AuthApi from "../api/AuthApi";
import TokenService from "../services/TokenService";

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

const LoginPage = () => {
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
      navigate("/user/edit");
    },
  });

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
