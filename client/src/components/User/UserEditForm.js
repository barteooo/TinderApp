import { useFormik } from "formik";
import UsersApi from "../../api/UsersApi";
import { useCallback, useEffect } from "react";
import UserImportData from "./UserImportData";
import UserExportData from "./UserExportData";
import UserDeleteData from "./UserDeleteData";

const UserEditForm = () => {
  useEffect(() => {
    getUserData();
  }, []);

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
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Name</label>
          <input name="name" type="text" {...formik.getFieldProps("name")} />
          {formik.touched.name && formik.errors.name ? (
            <div>{formik.errors.name}</div>
          ) : null}
        </div>
        <div>
          <label>Surname</label>
          <input
            name="surname"
            type="text"
            {...formik.getFieldProps("surname")}
          />
          {formik.touched.surname && formik.errors.surname ? (
            <div>{formik.errors.surname}</div>
          ) : null}
        </div>
        <div>
          <label>gender</label>
          <select name="gender" type="text" {...formik.getFieldProps("gender")}>
            <option value="men">men</option>
            <option value="woman">woman</option>
          </select>
          {formik.touched.gender && formik.errors.gender ? (
            <div>{formik.errors.gender}</div>
          ) : null}
        </div>
        <div>
          <label>Date of birth</label>
          <input
            name="dateOfBirth"
            type="date"
            {...formik.getFieldProps("dateOfBirth")}
          />
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
            <div>{formik.errors.dateOfBirth}</div>
          ) : null}
        </div>
        <div>
          <label>Interest</label>
          <div>
            <div>
              <label>football</label>
              <input
                type="checkbox"
                checked={formik.values.interests.includes("football")}
                onChange={(e) =>
                  handleChangeCheckbox(
                    "interests",
                    e.target.checked,
                    "football"
                  )
                }
              />
            </div>
            <div>
              <label>bike</label>
              <input
                type="checkbox"
                checked={formik.values.interests.includes("bike")}
                onChange={(e) =>
                  handleChangeCheckbox("interests", e.target.checked, "bike")
                }
              />
            </div>
            <div>
              <label>netflix</label>
              <input
                type="checkbox"
                checked={formik.values.interests.includes("netflix")}
                onChange={(e) =>
                  handleChangeCheckbox("interests", e.target.checked, "netflix")
                }
              />
            </div>
          </div>

          <div>
            <div>
              <label>skating</label>
              <input
                type="checkbox"
                checked={formik.values.interests.includes("skating")}
                onChange={(e) =>
                  handleChangeCheckbox("interests", e.target.checked, "skating")
                }
              />
            </div>
            <div>
              <label>swimming</label>
              <input
                type="checkbox"
                checked={formik.values.interests.includes("swimming")}
                onChange={(e) =>
                  handleChangeCheckbox(
                    "interests",
                    e.target.checked,
                    "swimming"
                  )
                }
              />
            </div>
          </div>

          {formik.touched.interest && formik.errors.interest ? (
            <div>{formik.errors.interest}</div>
          ) : null}
        </div>
        <div>
          <label>About</label>
          <textarea
            name="about"
            type="text"
            {...formik.getFieldProps("about")}
          ></textarea>
          {formik.touched.about && formik.errors.about ? (
            <div>{formik.errors.about}</div>
          ) : null}
        </div>
        <div>
          <label>Images</label>
          <textarea {...formik.getFieldProps("images")}></textarea>
          {formik.touched.images && formik.errors.images ? (
            <div>{formik.errors.images}</div>
          ) : null}
        </div>
        <div>
          <div>
            <label>Gender interest</label>
            <select
              name="genderInterest"
              type="text"
              {...formik.getFieldProps("genderInterest")}
            >
              <option value="men">men</option>
              <option value="woman">woman</option>
            </select>
            {formik.touched.genderInterest && formik.errors.genderInterest ? (
              <div>{formik.errors.genderInterest}</div>
            ) : null}
          </div>
        </div>
        <div>
          <label>Filter by interests</label>
          <input
            type="checkbox"
            checked={formik.values.filterByInterests}
            value={formik.values.filterByInterests}
            onChange={(e) => {
              formik.setFieldValue("filterByInterests", e.target.checked);
            }}
          />
        </div>
        <div>
          <button type="submit">Update</button>
        </div>
      </form>
      <UserImportData getUserData={getUserData} />
      <UserExportData />
      <UserDeleteData />
    </div>
  );
};

export default UserEditForm;