const userTableReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_USER_TABLE":
      return action.payload;
    default:
      return state;
  }
};

export default userTableReducer;
