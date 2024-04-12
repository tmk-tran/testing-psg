import { Box, Card, CardContent, Typography } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { User } from "../../hooks/reduxStore";
import { borderPrimaryColor } from "../Utils/colors";
import { redeemCouponSweetAlert } from "../Utils/sweetAlerts";
import { dispatchHook } from "../../hooks/useDispatch";
import { centeredStyle } from "../Utils/pageStyles";
import { capitalizeWords } from "../Utils/helpers";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import BottomSection from "./BottomSection";
import RedeemButton from "./RedeemButton";
import PdfThumbnail from "../PdfThumbnail/PdfThumbnail";
import NoFile from "./NoFile";
import ThumbView from "./ThumbVIew";
import CouponDetails from "./CouponDetails";

export default function CouponCard({ isMobile, coupon, i }) {
  const dispatch = dispatchHook();
  console.log(coupon);

  const user = User() || {};
  console.log(user);

  const cardStyle = {
    mb: 4,
    width: isMobile ? "100%" : "75%",
    backgroundColor: "#F0F0F0",
  };

  const couponPreviewStyle = {
    height: "150px",
    width: "200px",
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

  const handleRedeem = (couponId, locationId, userId) => {
    console.log(couponId);
    console.log(locationId);
    console.log(userId);
    const saveCall = () => {
      const redeemAction = {
        type: "REDEEM_COUPON",
        payload: {
          couponId,
          locationId,
          userId,
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
          />
        </Box>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ Locations Accepted ~~~~~~~~~~ */}
        <BottomSection isMobile={isMobile} coupon={coupon} />
      </CardContent>
    </Card>
  );
}
