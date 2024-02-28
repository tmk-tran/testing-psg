import { Box, Grid, Typography } from "@mui/material";
import CouponCard from "./CouponCard";
import { border } from "../Utils/colors";
import { containerStyle } from "../Utils/pageStyles";

export default function ConsumerCouponView() {
  return (
    <Box sx={containerStyle}>
      <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
        Consumer Coupon View
      </Typography>
      <br />
      {/* <Grid container spacing={2}>
        <Grid item xs={6}> */}
          {/* First column */}
          {/* <CouponCard />
          <CouponCard />
          <CouponCard />
          <CouponCard />
        </Grid>
        <Grid item xs={6}> */}
          {/* Second column */}
          {/* <CouponCard />
          <CouponCard />
          <CouponCard />
          <CouponCard />
        </Grid>
      </Grid>
    </Box> */}
    <CouponCard />
    <CouponCard />
    <CouponCard />
    <CouponCard />
    <CouponCard />
    <CouponCard />
    <CouponCard />
    <CouponCard />
    </Box>
  );
}
