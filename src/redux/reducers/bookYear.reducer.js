const bookYearReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_BOOK_YEAR":
      return action.payload;
    default:
      return state;
  }
};

export default bookYearReducer;
