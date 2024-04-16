export const setCouponFiles = (files) => ({
  type: "SET_COUPON_FILES",
  payload: files,
});

export const fetchCouponFilesFailure = (error) => ({
  type: "FETCH_COUPON_FILES_FAILURE",
  payload: error,
});

// For loading reducer
export const setLoading = (isLoading) => ({
  type: "SET_LOADING",
  payload: isLoading,
});
