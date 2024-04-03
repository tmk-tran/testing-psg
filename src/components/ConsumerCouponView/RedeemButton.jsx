import { Box, Button, Typography } from "@mui/material";

export default function RedeemButton({ isMobile, coupon, user, handleRedeem }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: isMobile ? "100%" : "undefined",
      }}
    >
      {/* ~~~~~ Value ~~~~~ */}
      <Box sx={{ mb: isMobile ? 0 : 1 }}>
        {coupon.value ? (
          <Typography variant="body2">Value: ${coupon.value}</Typography>
        ) : (
          <>{!isMobile ? <Box sx={{ minHeight: "1.1rem" }}></Box> : null}</>
        )}
      </Box>
      {/* ~~~~~ Redeem Button ~~~~~ */}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleRedeem(coupon.id, coupon.locationId, user.id)}
        sx={{ mt: isMobile ? 3 : 5, mb: isMobile ? 3 : 0 }}
      >
        Redeem
      </Button>
    </Box>
  );
}
