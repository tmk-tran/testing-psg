const initialState = {
  customerAddedSuccessfully: false,
  // other initial state values
};

const customerAdded = (state = initialState, action) => {
  switch (action.type) {
    case "CUSTOMER_ADDED_SUCCESSFULLY":
      return {
        ...state,
        customerAddedSuccessfully: action.payload,
      };
    // other case statements for handling other actions
    default:
      return state;
  }
};

export default customerAdded;
