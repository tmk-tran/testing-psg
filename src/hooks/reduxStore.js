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
  return useSelector((store) => store.organizations);
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

export const mTasks = () => {
  return useSelector((store) => store.merchantTasks);
};

export const User = () => {
  return useSelector((store) => store.user);
};

export const Errors = () => {
  return useSelector((store) => store.errors);
};
