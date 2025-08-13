import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CouponCard from "./CouponCard";
import { appActiveYear, User, userBooksData } from "../../hooks/reduxStore";
import { useMediaQuery, useTheme } from "@mui/material";

const RedeemedList = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Select redeemed coupons from reducer
  const user = User();
  const userCoupons = userBooksData();
  console.log("Incoming coupons:", userCoupons);
  const redeemedCoupons = userCoupons?.redeemed;
  console.log("Redeemed coupons:", redeemedCoupons);
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

  return (
    <div>
      {redeemedCoupons ? (
        redeemedCoupons.map((coupon, index) => (
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
