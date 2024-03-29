import { Box, Card, CardContent, Typography } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { User } from "../../hooks/reduxStore";
import { border, borderPrimaryColor } from "../Utils/colors";
import { redeemCouponSweetAlert } from "../Utils/sweetAlerts";
import { dispatchHook } from "../../hooks/useDispatch";
import { flexCenter, flexRowSpace, centeredStyle } from "../Utils/pageStyles";
import { capitalizeWords, formatDate } from "../Utils/helpers";
import { thumbnailSize } from "../CouponReviewDetails/FilePreview";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import BottomSection from "./BottomSection";
import RedeemButton from "./RedeemButton";
import PdfThumbnail from "../PdfThumbnail/PdfThumbnail";
import NoFile from "./NoFile";

const cardStyle = {
  mb: 4,
  width: "75%",
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

export default function CouponCard({ coupon, i }) {
  const dispatch = dispatchHook();
  console.log(coupon);

  const user = User() || {};
  console.log(user);

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
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
          <Box sx={previewBoxStyle}>
            <Typography variant="caption" sx={{ lineHeight: 1 }}>
              Front
            </Typography>
            {coupon.frontViewBlob !== null ? (
              <PdfThumbnail
                pdf={coupon.frontViewBlob}
                style={couponPreviewStyle}
                width={200}
                caseType="consumer"
              />
            ) : (
              <NoFile label="No file available" sx={couponPreviewStyle} />
            )}
          </Box>
          <Box sx={previewBoxStyle}>
            Back
            {coupon.backViewBlob !== null ? (
              <PdfThumbnail
                pdf={coupon.backViewBlob}
                style={couponPreviewStyle}
                width={200}
                caseType="consumer"
              />
            ) : (
              <NoFile label="No file available" sx={couponPreviewStyle} />
            )}
          </Box>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ Coupon Details ~~~~~~~~~ */}
          <Box
            sx={{
              flexGrow: 1,
            }}
          >
            <div style={{ ...centeredStyle, margin: "25px auto" }}>
              <Typography variant="body2">{coupon.merchantName}</Typography>
              <Typography sx={{ fontWeight: "bold" }}>
                {capitalizeWords(coupon.offer)}
              </Typography>
              <Typography variant="caption" sx={{ lineHeight: 1 }}>
                {coupon.additionalInfo
                  ? capitalizeWords(coupon.additionalInfo)
                  : ""}
              </Typography>
              {/* <Typography variant="caption">
              Expires:{" "}
              {coupon.expiration ? (
                formatDate(coupon.expiration)
              ) : (
                <Typography variant="caption">No expiration set</Typography>
              )}
            </Typography> */}
              <Typography variant="caption">
                {coupon.exclusions ? (
                  <>Exclusions: {capitalizeWords(coupon.exclusions)}</>
                ) : null}
              </Typography>
            </div>
          </Box>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ Redeem Button ~~~~~~~~~~ */}
          <RedeemButton
            coupon={coupon}
            user={user}
            handleRedeem={handleRedeem}
          />
        </Box>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ Locations Accepted ~~~~~~~~~~ */}
        <BottomSection coupon={coupon} />
      </CardContent>
    </Card>
  );
}
