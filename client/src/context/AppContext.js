import { createContext } from "react";

export const initialState = {
  user: {},
  matchedUsers: [],
};

const appContext = createContext({});

export default appContext;
