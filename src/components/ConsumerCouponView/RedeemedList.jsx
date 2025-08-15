import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { appActiveYear, User, userBooksData } from "../../hooks/reduxStore";
import { useMediaQuery, useTheme } from "@mui/material";

import CouponCard from "./CouponCard";

const RedeemedList = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Select redeemed coupons from reducer
  const user = User();
  const userCoupons = userBooksData();
  const redeemedCoupons = userCoupons?.redeemed;
  // For Coupon Book Year
  const activeYear = appActiveYear();
  // Year ID
  const activeYearId = activeYear && activeYear[0] ? activeYear[0].id : "";

  // Fetch redeemed coupons when component mounts
  useEffect(() => {
    const dispatchAction = {
      type: "FETCH_REDEEMED_COUPONS",
      payload: { userId: user?.id, yearId: activeYearId }, // replace with real values
    };
    dispatch(dispatchAction);
  }, [activeYear]);

  // Prepare coupons with complete URLs
  const baseURL = "https://fly.storage.tigris.dev/coupons/";
  const preparedRedeemedCoupons = redeemedCoupons?.map((coupon) => ({
    ...coupon,
    backViewUrl: coupon.backViewUrl ? `${baseURL}${coupon.backViewUrl}` : null,
    frontViewUrl: coupon.frontViewUrl
      ? `${baseURL}${coupon.frontViewUrl}`
      : null,
  }));

  return (
    <div>
      {preparedRedeemedCoupons && preparedRedeemedCoupons.length > 0 ? (
        preparedRedeemedCoupons.map((coupon, index) => (
          <CouponCard
            key={index}
            coupon={coupon}
            isMobile={isMobile}
            redeemed={true}
          />
        ))
      ) : (
        <p>No redeemed coupons found</p>
      )}
    </div>
  );
};

export default RedeemedList;
