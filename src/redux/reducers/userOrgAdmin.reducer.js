const userOrgAdminReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_ORG_ADMINS":
      return action.payload;
    default:
      return state;
  }
};

export default userOrgAdminReducer;
