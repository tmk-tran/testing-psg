const activeYearReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_APP_YEAR":
      return action.payload;
    default:
      return state;
  }
};

export default activeYearReducer;
