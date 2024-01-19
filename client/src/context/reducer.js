import { initialState } from "./AppContext";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_MATCHED_USERS":
      return { ...state, matchedUsers: [...action.payload] };
    case "CLEAR":
      return { ...initialState };
    default:
      return state;
  }
};

export default reducer;
