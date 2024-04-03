import { combineReducers } from "redux";
import errors from "./errors.reducer";
import user from "./user.reducer";
import auth from "./auth.reducer";
import orgDetails from "./orgDetails.reducer";
import organizations from "./organizations.reducer.js";
import group from "./group.reducer";
import fundraisers from "./fundraisers.reducer";
import orgFundraisers from "./orgFundraiser.js";
import orgGroups from "./orgGroups.reducer";
import archivedOrganizations from "./archivedOrganizations.reducer.js";
import allGroups from "./allGroups.reducer.js";
import couponBooks from "./couponBook.reducer";
import orgNotes from "./orgNotes.reducer.js";
import allUsers from "./allUsers.reducer.js";
import groupAdmin from "./groupAdmin.reducer";
import coupons from "./coupons.reducer";
import merchantDetails from "./merchantDetails.reducer";
import merchantNotes from "./merchantNotes.reducer";
import merchantTasks from "./merchantTask.reducer";
import merchants from "./merchants.reducer";
import merchantCoupons from "./merchantsCoupon.reducer.js";
import merchantComments from "./merchantComments.reducer";
import orgTasks from "./organizationTask.reducer";
import locations from "./locations.reducer";
import sellers from "./sellers.reducer";
import sellerPage from "./sellerPage.reducer";
import customers from "./customers.reducer";
import rolesReducer from "./roles.reducer";
import paypal from "./paypal.reducer";
import bookYear from "./bookYear.reducer";
import sellerByRefId from "./sellerByRefId.reducer";

// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  user, // will have an id and username if someone is logged in
  orgDetails,
  organizations,
  group,
  fundraisers,
  orgFundraisers,
  orgGroups,
  archivedOrganizations,
  allGroups,
  couponBooks,
  groupAdmin,
  orgNotes,
  allUsers,
  coupons,
  merchantNotes,
  merchantDetails,
  merchantTasks,
  merchants,
  merchantCoupons,
  merchantComments,
  orgTasks,
  locations,
  sellers,
  sellerPage,
  customers,
  auth,
  rolesReducer,
  paypal,
  bookYear,
  sellerByRefId
});

export default rootReducer;
