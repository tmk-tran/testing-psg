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
            {coupon.expiration ? (
          <Typography variant="caption">
            Expires:{" "}
              {formatDate(coupon.expiration)}
          </Typography>
            ) : (
            //   <Typography variant="caption">None set</Typography>
              null
            )}
        </Grid>
      </Grid>
    </Box>
  );
}
