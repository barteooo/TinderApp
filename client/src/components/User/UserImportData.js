import { useCallback, useState } from "react";
import UsersApi from "../../api/UsersApi";

const UserImportData = ({ getUserData }) => {
  const [importFile, setImportFile] = useState(null);

  const handleSubmitImportAccountToFile = useCallback(
    async (e) => {
      e.preventDefault();

      if (!importFile) {
        alert("Wybierz plik");
        return;
      }

      const result = await UsersApi.importProfileFile(importFile);
      if (!result.success) {
        alert("Błąd importu!");
        return;
      }

      setImportFile(null);
      e.target.reset();

      getUserData();
    },
    [importFile, getUserData]
  );

  return (
    <div>
      <div>
        <form onSubmit={handleSubmitImportAccountToFile}>
          <input
            type="file"
            accept="application/json"
            onChange={(e) => {
              setImportFile(e.target.files?.[0]);
            }}
          />
          <button type="submit">Import</button>
        </form>
      </div>
    </div>
  );
};

export default UserImportData;
