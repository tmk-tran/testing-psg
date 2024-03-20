import { Box, Typography, Grid } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~~~~~~ //
import { formatDate } from "../Utils/helpers";
import { flexCenter } from "../Utils/pageStyles";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import LocationSection from "./LocationSection";

export default function BottomSection({ coupon }) {
  if (!coupon) {
    return null;
  }

  return (
    <Box>
      <Grid container>
        <Grid item xs={10}>
          <Box sx={{ ...flexCenter }}>
            <LocationSection coupon={coupon} />
          </Box>
        </Grid>
        <Grid item xs={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography variant="caption">
            Expires:{" "}
            {coupon.expiration ? (
              formatDate(coupon.expiration)
            ) : (
              <Typography variant="caption">None set</Typography>
            )}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
