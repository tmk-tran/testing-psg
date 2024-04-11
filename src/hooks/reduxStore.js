import { useSelector } from "react-redux";

export const oDetails = () => {
  return useSelector((store) => store.orgDetails);
};

export const oGroups = () => {
  return useSelector((store) => store.orgGroups);
};

export const oNotes = () => {
  return useSelector((store) => store.orgNotes);
};

export const oFundraisers = () => {
  return useSelector((store) => store.orgFundraisers);
};

export const allOrganizations = () => {
  return useSelector((store) => store.organizations.organization);
};

export const allMerchants = () => {
  return useSelector((store) => store.merchants);
};

export const mDetails = () => {
  return useSelector((store) => store.merchantDetails);
};

export const mNotes = () => {
  return useSelector((store) => store.merchantNotes);
};

export const oTasks = () => {
  return useSelector((store) => store.orgTasks);
};

export const mTasks = () => {
  return useSelector((store) => store.merchantTasks);
};

export const mComments = () => {
  return useSelector((store) => store.merchantComments);
};

export const mLocations = () => {
  return useSelector((store) => store.locations);
};

export const mCoupons = () => {
  return useSelector((store) => store.merchantCoupons);
};

export const oSellers = () => {
  return useSelector((store) => store.sellers);
};

export const sellerPageInfo = () => {
  return useSelector((store) => store.sellerPage);
};

export const couponsData = () => {
  return useSelector((store) => store.coupons);
};

export const bookYear = () => {
  return useSelector((store) => store.bookYear);
};

export const allYears = () => {
  return useSelector((store) => store.couponBooks);
};

export const customerList = () => {
  return useSelector((store) => store.customers);
};

export const paypalTransactions = () => {
  return useSelector((store) => store.paypal);
};

export const digitalBookTypeSold = () => {
  return useSelector((store) => store.digitalBookType);
};

export const userTableData = () => {
  return useSelector((store) => store.userTable);
};

export const userBooksData = () => {
  return useSelector((store) => store.userBooks);
};

export const User = () => {
  return useSelector((store) => store.user);
};

export const Errors = () => {
  return useSelector((store) => store.errors);
};
