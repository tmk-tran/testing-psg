import { Box, Card, CardContent } from "@mui/material";
// ~~~~~~~~~~ Hooks/Utils ~~~~~~~~~~ //
import { User } from "../../hooks/reduxStore";
import { dispatchHook } from "../../hooks/useDispatch";
import { borderPrimaryColor } from "../Utils/colors";
import { centeredStyle } from "../Utils/pageStyles";
import { redeemCouponSweetAlert } from "../Utils/sweetAlerts";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import BottomSection from "./BottomSection";
import ThumbView from "./ThumbView";
import CouponDetails from "./CouponDetails";

export const couponPreviewStyle = {
  height: "150px",
  width: "200px",
};

const cardStyle = {
  mb: 4,
  backgroundColor: "#F0F0F0",
};

const previewBoxStyle = {
  ...borderPrimaryColor,
  textAlign: "center",
  mb: 1,
  overflow: "hidden",
};

const mobilePreviewBox = {
  // ...borderPrimaryColor,
  textAlign: "center",
  // height: 90,
  overflow: "hidden",
  position: "relative",
  width: "100%",
};

export default function CouponCard({ coupon, i, isMobile, redeemed }) {
  const dispatch = dispatchHook();

  const user = User() || {};

  const handleRedeem = (couponId, locationId, userId, yearId) => {
    const saveCall = () => {
      const redeemAction = {
        type: "REDEEM_COUPON",
        payload: {
          couponId: couponId,
          locationId: locationId,
          userId: userId,
          yearId: yearId,
        },
      };
      console.log(redeemAction);
      dispatch(redeemAction);
    };
    redeemCouponSweetAlert(saveCall);
  };

  return (
    <Card key={i} elevation={3} sx={cardStyle}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 1,
          }}
        >
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~ File Previews ~~~~~ */}
          <ThumbView
            isMobile={isMobile}
            mobilePreviewBox={mobilePreviewBox}
            previewBoxStyle={previewBoxStyle}
            couponPreviewStyle={couponPreviewStyle}
            coupon={coupon}
          />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ Coupon Details ~~~~~~~~~ */}
          <CouponDetails
            isMobile={isMobile}
            centeredStyle={centeredStyle}
            coupon={coupon}
            user={user}
            handleRedeem={handleRedeem}
            redeemed={redeemed}
          />
        </Box>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ Locations Accepted ~~~~~~~~~~ */}
        <BottomSection isMobile={isMobile} coupon={coupon} />
      </CardContent>
    </Card>
  );
}
