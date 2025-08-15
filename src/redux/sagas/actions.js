export const setCouponFiles = (files) => ({
  type: "SET_COUPON_FILES",
  payload: files,
});

// Needs finish setting up - action not wired
export const fetchCouponFilesFailure = (error) => ({
  type: "FETCH_COUPON_FILES_FAILURE",
  payload: error,
});
