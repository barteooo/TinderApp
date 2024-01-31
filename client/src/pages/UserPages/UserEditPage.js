import { useFormik } from "formik";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersApi from "../../api/UsersApi";
import TokenService from "../../services/TokenService";
import config from "../../config";
import AppContext from "../../context/AppContext";
import UserEditForm from "../../components/User/UserEditForm";
import UserExportData from "../../components/User/UserExportData";
import UserDeleteData from "../../components/User/UserDeleteData";
import UserImportData from "../../components/User/UserImportData";

const UserEditPage = () => {
  return (
    <div>
      <h1>User edit page</h1>
      <UserEditForm />
    </div>
  );
};

export default UserEditPage;
