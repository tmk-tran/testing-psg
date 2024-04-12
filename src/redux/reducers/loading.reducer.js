// reducers.js
const initialState = {
  isLoading: true,
  // other initial state
};

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    // other cases
    default:
      return state;
  }
};

export default loadingReducer;
