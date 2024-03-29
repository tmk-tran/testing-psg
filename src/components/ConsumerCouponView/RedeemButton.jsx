import { Box, Button, Typography } from "@mui/material";

export default function RedeemButton({ coupon, user, handleRedeem }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ml: "auto",
      }}
    >
      <Box sx={{ mb: 1 }}>
        {coupon.value ? (
          <Typography variant="body2">Value: ${coupon.value}</Typography>
        ) : (
          <Box sx={{ minHeight: "1.1rem" }}></Box>
        )}
      </Box>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleRedeem(coupon.id, coupon.locationId, user.id)}
        sx={{ mt: 5 }}
      >
        Redeem
      </Button>
    </Box>
  );
}
