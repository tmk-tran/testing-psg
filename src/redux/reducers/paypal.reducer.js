const paypalReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_PAYPAL_TRANSACTIONS":
      return action.payload;
    default:
      return state;
  }
};

export default paypalReducer;
