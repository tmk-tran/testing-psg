import { Box, Typography } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~~~~~ //
import { capitalizeWords } from "../Utils/helpers";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import RedeemButton from "./RedeemButton";

export default function CouponDetails({
  isMobile,
  centeredStyle,
  coupon,
  user,
  handleRedeem,
}) {
  return (
    <>
      {isMobile ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: isMobile ? "100%" : "undefined",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
            }}
          >
            <div
              style={{
                ...centeredStyle,
                margin: isMobile ? "0" : "25px auto",
              }}
            >
              {/* ~~~~~ NAME ~~~~~ */}
              <Typography variant="body2">{coupon.merchantName}</Typography>
              {/* ~~~~~ OFFER ~~~~~ */}
              <Typography sx={{ fontWeight: "bold" }}>
                {capitalizeWords(coupon.offer)}
              </Typography>
              {/* ~~~~~ ADDITIONAL INFO ~~~~~ */}
              <Typography variant="caption" sx={{ lineHeight: 1 }}>
                {coupon.additionalInfo
                  ? capitalizeWords(coupon.additionalInfo)
                  : ""}
              </Typography>
              {/* ~~~~~ EXCLUSIONS ~~~~~ */}
              <Typography
                variant={"caption"}
                sx={{
                  fontSize: isMobile ? 12 : "undefined",
                  textAlign: isMobile ? "center" : "undefined",
                }}
              >
                {coupon.exclusions ? (
                  <>Exclusions: {capitalizeWords(coupon.exclusions)}</>
                ) : null}
              </Typography>
            </div>
          </Box>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ Redeem Button ~~~~~~~~~~ */}
          <RedeemButton
            isMobile={isMobile}
            coupon={coupon}
            user={user}
            handleRedeem={handleRedeem}
          />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              flexGrow: 1,
            }}
          >
            <div style={{ ...centeredStyle, margin: "25px auto" }}>
              {/* ~~~~~ NAME ~~~~~ */}
              <Typography variant="body2">{coupon.merchantName}</Typography>
              {/* ~~~~~ OFFER ~~~~~ */}
              <Typography sx={{ fontWeight: "bold" }}>
                {capitalizeWords(coupon.offer)}
              </Typography>
              {/* ~~~~~ ADDITIONAL INFO ~~~~~ */}
              <Typography variant="caption" sx={{ lineHeight: 1 }}>
                {coupon.additionalInfo
                  ? capitalizeWords(coupon.additionalInfo)
                  : ""}
              </Typography>
              {/* ~~~~~ EXCLUSIONS ~~~~~ */}
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
            isMobile={isMobile}
            coupon={coupon}
            user={user}
            handleRedeem={handleRedeem}
          />
        </>
      )}
    </>
  );
}
