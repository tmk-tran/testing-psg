import { Typography, useMediaQuery, useTheme } from "@mui/material";

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
        <Typography variant="subtitle1" color="text.secondary">
          No redeemed coupons found
        </Typography>
      )}
    </div>
  );
};

export default RedeemedList;
