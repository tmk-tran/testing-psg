const rolesReducer = (state = [], action) => {
    switch (action.type) {
      case "SET_ROLES":
        return action.payload;
      default:
        return state;
    }
  };
  
  export default rolesReducer;