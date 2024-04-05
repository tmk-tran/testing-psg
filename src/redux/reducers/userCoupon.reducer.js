const userCouponReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_CONSUMER_BOOKS":
      return action.payload;
    default:
      return state;
  }
};

export default userCouponReducer;
