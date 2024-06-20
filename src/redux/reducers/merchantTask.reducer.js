const merchantTaskReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_MERCHANT_TASKS":
      return action.payload;
    default:
      return state;
  }
};

export default merchantTaskReducer;
