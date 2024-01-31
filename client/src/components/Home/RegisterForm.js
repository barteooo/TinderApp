import { useFormik } from "formik";
import * as Yup from "yup";
import AuthApi from "../../api/AuthApi";
import { useNavigate } from "react-router-dom";

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
            <label>Repeat password</label>
            <input
              name="reppassword"
              type="password"
              {...formik.getFieldProps("reppassword")}
            />
            {formik.touched.reppassword && formik.errors.reppassword ? (
              <p>{formik.errors.reppassword}</p>
            ) : null}
          </div>
          <div>
            <button type="submit">Register</button>
          </div>
          {formik.errors.error ? <p>{formik.errors.error}</p> : null}
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
