import { useFormik } from "formik";
import UsersApi from "../../api/UsersApi";
import { useCallback, useEffect, useContext } from "react";
import UserImportData from "./UserImportData";
import UserExportData from "./UserExportData";
import UserDeleteData from "./UserDeleteData";
import appContext from "../../context/AppContext";

const UserEditForm = () => {
  useEffect(() => {
    getUserData();
  }, []);

  const { dispatch, contextState } = useContext(appContext);

  const formik = useFormik({
    initialValues: {
      name: "",
      surname: "",
      gender: "men",
      dateOfBirth: "",
      interests: [],
      genderInterest: "men",
      about: "",
      images: "",
      filterByInterests: false,
    },
    onSubmit: async (values) => {
      const userData = { ...values };
      userData.images = userData.images ? userData.images.split("\n") : [];
      await UsersApi.updateCurrent(userData);
      dispatch({
        type: "SET_USER",
        payload: { ...contextState.user, ...values },
      });

      getUserData();
      return;
    },
  });

  const getUserData = useCallback(async () => {
    const result = await UsersApi.getCurrentUser();
    formik.setValues({
      name: result.user.name,
      surname: result.user.surname,
      gender: result.user.gender ? result.user.gender : "men",
      dateOfBirth: result.user.dateOfBirth,
      interests: result.user.interests,
      genderInterest: result.user.genderInterest
        ? result.user.genderInterest
        : "men",
      about: result.user.about,
      images: result.user.images.join("\n"),
      filterByInterests: result.user.filterByInterests,
    });
  }, []);

  const handleChangeCheckbox = useCallback(
    (field, checked, value) => {
      if (checked) {
        const interests = [...formik.values[field], value];
        formik.setFieldValue(field, interests);
      } else {
        const interests = formik.values[field].filter((x) => x !== value);
        formik.setFieldValue(field, [...interests]);
      }
    },
    [formik]
  );

  return (
    <div className="form-container">
      <h1 className="form-caption">User</h1>
      <form className="form" onSubmit={formik.handleSubmit}>
        <div className="form-item">
          <label className="form-label">Name</label>
          <input
            className="input"
            name="name"
            type="text"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="form-alert form-alert-danger">
              {formik.errors.name}
            </div>
          ) : null}
        </div>
        <div className="form-item">
          <label className="form-label">Surname</label>
          <input
            className="input"
            name="surname"
            type="text"
            {...formik.getFieldProps("surname")}
          />
        </div>
        {formik.touched.surname && formik.errors.surname ? (
          <div className="form-alert form-alert-danger">
            {formik.errors.surname}
          </div>
        ) : null}
        <div className="form-item">
          <label className="form-label">gender</label>
          <select
            className="input"
            name="gender"
            type="text"
            {...formik.getFieldProps("gender")}
          >
            <option value="men">men</option>
            <option value="woman">woman</option>
          </select>
        </div>
        {formik.touched.gender && formik.errors.gender ? (
          <div className="form-alert form-alert-danger">
            {formik.errors.gender}
          </div>
        ) : null}
        <div className="form-item">
          <label className="form-label">Date of birth</label>
          <input
            className="input"
            name="dateOfBirth"
            type="date"
            {...formik.getFieldProps("dateOfBirth")}
          />
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
            <div>{formik.errors.dateOfBirth}</div>
          ) : null}
        </div>
        <div className="form-checkbox-container">
          <p className="form-checkbox-container-caption">Interest</p>
          <div className="form-item-checkbox">
            <label className="form-label-checkbox">football</label>
            <input
              type="checkbox"
              checked={formik.values.interests.includes("football")}
              onChange={(e) =>
                handleChangeCheckbox("interests", e.target.checked, "football")
              }
            />
          </div>
          <div className="form-item-checkbox">
            <label className="form-label-checkbox">bike</label>
            <input
              type="checkbox"
              checked={formik.values.interests.includes("bike")}
              onChange={(e) =>
                handleChangeCheckbox("interests", e.target.checked, "bike")
              }
            />
          </div>
          <div className="form-item-checkbox">
            <label className="form-label-checkbox">netflix</label>
            <input
              type="checkbox"
              checked={formik.values.interests.includes("netflix")}
              onChange={(e) =>
                handleChangeCheckbox("interests", e.target.checked, "netflix")
              }
            />
          </div>
          <div className="form-item-checkbox">
            <label className="form-label-checkbox">skating</label>
            <input
              type="checkbox"
              checked={formik.values.interests.includes("skating")}
              onChange={(e) =>
                handleChangeCheckbox("interests", e.target.checked, "skating")
              }
            />
          </div>
          <div className="form-item-checkbox">
            <label className="form-label-checkbox">swimming</label>
            <input
              type="checkbox"
              checked={formik.values.interests.includes("swimming")}
              onChange={(e) =>
                handleChangeCheckbox("interests", e.target.checked, "swimming")
              }
            />
          </div>

          {formik.touched.interest && formik.errors.interest ? (
            <div className="form-alert form-alert-danger">
              {formik.errors.interest}
            </div>
          ) : null}
        </div>
        <div className="form-item">
          <label className="form-label">About</label>
          <textarea
            className="input"
            name="about"
            type="text"
            {...formik.getFieldProps("about")}
          ></textarea>
        </div>
        {formik.touched.about && formik.errors.about ? (
          <div className="form-alert form-alert-danger">
            {formik.errors.about}
          </div>
        ) : null}
        <div className="form-item">
          <label className="form-label">Images</label>
          <textarea
            className="input"
            {...formik.getFieldProps("images")}
          ></textarea>
          {formik.touched.images && formik.errors.images ? (
            <div>{formik.errors.images}</div>
          ) : null}
        </div>
        <div className="form-item">
          <label className="form-label">Gender interest</label>
          <select
            className="input"
            name="genderInterest"
            type="text"
            {...formik.getFieldProps("genderInterest")}
          >
            <option value="men">men</option>
            <option value="woman">woman</option>
          </select>
        </div>
        {formik.touched.genderInterest && formik.errors.genderInterest ? (
          <div className="form-alert form-alert-danger">
            {formik.errors.genderInterest}
          </div>
        ) : null}
        <div className="form-checkbox-container ">
          <div className="form-item-checkbox">
            <label className="form-label-checkbox">Filter by interests</label>
            <input
              type="checkbox"
              checked={formik.values.filterByInterests}
              value={formik.values.filterByInterests}
              onChange={(e) => {
                formik.setFieldValue("filterByInterests", e.target.checked);
              }}
            />
          </div>
        </div>
        <div className="form-item form-item-center">
          <button
            className="primary-button"
            style={{ marginTop: 20 }}
            type="submit"
          >
            Update
          </button>
        </div>
      </form>

      <div className="action-buttons-contaier">
        <h1>User actions</h1>
        <UserExportData />
        <UserImportData getUserData={getUserData} />
        <UserDeleteData />
      </div>
    </div>
  );
};

export default UserEditForm;
