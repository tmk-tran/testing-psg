const sellerSearchReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_SEARCHED_SELLER":
      return action.payload;
    case "RESET_SEARCHED_SELLERS":
      return [];
    default:
      return state;
  }
};

export default sellerSearchReducer;
