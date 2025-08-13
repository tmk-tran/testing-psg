const initialState = {
  unredeemed: [],
  redeemed: [],
};

const userCouponReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CONSUMER_BOOKS":
      return { ...state, unredeemed: action.payload }; // store unredeemed
    case "SET_REDEEMED_COUPONS":
      return { ...state, redeemed: action.payload }; // store redeemed
    default:
      return state;
  }
};

export default userCouponReducer;
