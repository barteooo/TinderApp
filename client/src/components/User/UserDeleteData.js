import { useCallback } from "react";
import UsersApi from "../../api/UsersApi";
import TokenService from "../../services/TokenService";
import { useNavigate } from "react-router-dom";

const UserDeleteData = () => {
  const navigate = useNavigate();
  const handleClickDeleteAccount = useCallback(async () => {
    const result = await UsersApi.deleteCurrentUser();
    if (result.success) {
      TokenService.removeToken();
      navigate("/login");
    } else {
      alert("Error");
    }
  }, [navigate]);
  return (
    <div>
      <button onClick={handleClickDeleteAccount}>Delete account</button>
    </div>
  );
};

export default UserDeleteData;
