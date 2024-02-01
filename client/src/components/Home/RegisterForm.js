import { useFormik } from "formik";
import * as Yup from "yup";
import AuthApi from "../../api/AuthApi";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const RegisterForm = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    reppassword: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      reppassword: "",
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      const result = await AuthApi.register(values);
      if (!result.success) {
        helpers.setErrors({ error: result.message });
        return;
      }

      navigate("/login");
    },
  });

  const handleClickNavToLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <div className="form-container">
      <h1 className="form-caption">Register</h1>
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
            placeholder="Password..."
            className="input"
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
        <div className="form-item form-item-row">
          <input
            placeholder="Repeat password..."
            className="input"
            name="reppassword"
            type="password"
            {...formik.getFieldProps("reppassword")}
          />
        </div>
        {formik.touched.reppassword && formik.errors.reppassword ? (
          <div className="form-alert form-alert-danger">
            {formik.errors.reppassword}
          </div>
        ) : null}
        <div className="form-item form-item-center">
          <button className="primary-button" type="submit">
            Register
          </button>
        </div>
        {formik.errors.error ? (
          <div className="form-alert form-alert-danger">
            {formik.errors.error}
          </div>
        ) : null}
      </form>
      <div className="form-item form-item-center">
        <button className="primary-button" onClick={handleClickNavToLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
