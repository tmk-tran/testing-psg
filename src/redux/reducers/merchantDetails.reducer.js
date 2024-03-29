const merchantDetailsReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_MERCHANT_DETAILS":
      return action.payload;
    case "SET_ERROR":
      // Reset the state to an empty array when an error occurs
      return [];
    default:
      return state;
  }
};

export default merchantDetailsReducer;
