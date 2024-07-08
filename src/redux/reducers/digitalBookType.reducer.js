const initialState = {
  digitalBookCredit: false, // Initial value
};

const digitalBookReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DIGITAL_BOOK":
      return {
        ...state,
        digitalBookCredit: action.payload,
      };
    default:
      return state;
  }
};

export default digitalBookReducer;
