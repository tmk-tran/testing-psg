import { Box, Button, Typography } from "@mui/material";

export default function RedeemButton({ isMobile, coupon, user, handleRedeem }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: isMobile ? "100%" : "undefined",
      }}
    >
      {/* ~~~~~ Value ~~~~~ */}
      {/* ~ Removed, at client request. PSG-203 ~ */}
      {/* <Box sx={{ mb: isMobile ? 0 : 1 }}>
      {coupon.value ? (
          <Typography variant="body2">Value: ${coupon.value}</Typography>
        ) : (
          <>{!isMobile ? <Box sx={{ minHeight: "1.1rem" }}></Box> : null}</>
        )}
      </Box> */}
      {/* ~~~~~ Redeem Button ~~~~~ */}
      <Button
        variant="contained"
        color="secondary"
        onClick={() =>
          handleRedeem(coupon.id, coupon.locationId, user.id, coupon.bookId)
        }
      >
        Redeem
      </Button>
    </Box>
  );
}
