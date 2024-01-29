const orgTaskReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_ORG_TASKS":
      return action.payload;
    default:
      return state;
  }
};

export default orgTaskReducer;
