import { useReducer } from "react";
import AppContext from "./AppContext";
import reducer from "./reducer";

const initialState = {
  user: {},
  matches: [],
};

const AppContextProvider = ({ children }) => {
  const [contextState, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ contextState, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
