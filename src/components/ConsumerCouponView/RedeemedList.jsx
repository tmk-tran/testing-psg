import { useMediaQuery, useTheme } from "@mui/material";

import CouponCard from "./CouponCard";

const RedeemedList = ({ redeemedCoupons }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div>
      {redeemedCoupons && redeemedCoupons.length > 0 ? (
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
