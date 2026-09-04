const couponsReducer = (state = null, action) => {
  switch (action.type) {
    case "GET_PDF":
      return action.payload;
    case "SET_COUPON_FILES":
      return action.payload;
    default:
      return state;
  }
};

export default couponsReducer;
