import { useCallback, useContext } from "react";
import appContext from "../../context/AppContext";
import config from "../../config";

const UserExportData = () => {
  const { contextState } = useContext(appContext);

  const handleClickExportAccountToFile = useCallback(async () => {
    window.location = `${config.API_ADDRES}/users/profilefile/${contextState.user.id}`;
  }, [contextState.user]);
  return (
    <div>
      <div>
        <button
          className="gray-button"
          onClick={handleClickExportAccountToFile}
        >
          Export account to file
        </button>
      </div>
    </div>
  );
};

export default UserExportData;
