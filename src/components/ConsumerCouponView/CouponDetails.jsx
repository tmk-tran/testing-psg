import { Box, Typography } from "@mui/material";
// ~~~~~~~~~~ Utils ~~~~~~~~~~~~~~ //
import { capitalizeWords } from "../Utils/helpers";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import RedeemButton from "./RedeemButton";

export default function CouponDetails({
  isMobile,
  centeredStyle,
  coupon,
  user,
  handleRedeem,
  redeemed,
}) {
  const content = (
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
        {coupon.additionalInfo ? capitalizeWords(coupon.additionalInfo) : ""}
      </Typography>
      {/* ~~~~~ EXCLUSIONS ~~~~~ */}
      <Typography
        variant="caption"
        sx={{
          fontSize: isMobile ? 12 : undefined,
          textAlign: isMobile ? "center" : undefined,
        }}
      >
        {coupon.exclusions ? (
          <>Exclusions: {capitalizeWords(coupon.exclusions)}</>
        ) : null}
      </Typography>
    </div>
  );
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: isMobile ? "100%" : undefined,
        flexGrow: 1,
      }}
    >
      <Box sx={{ flexGrow: 1 }}>{content}</Box>
      <RedeemButton
        isMobile={isMobile}
        coupon={coupon}
        user={user}
        disabled={redeemed} // disabled if redeemed
        handleRedeem={redeemed ? undefined : handleRedeem} // only pass handler if not redeemed
      />
    </Box>
  );
}
