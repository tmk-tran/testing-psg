const initialState = {
  physicalBookCash: false, // Initial value
  digitalBookCredit: false, // Initial value
};

const digitalBookReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DIGITAL_BOOK":
      return {
        ...state,
        digitalBookCredit: action.payload,
      };
    case "SET_PHYSICAL_BOOK":
      return {
        ...state,
        physicalBookCash: action.payload,
      };
    default:
      return state;
  }
};

export default digitalBookReducer;
