import { Box, Typography, Grid } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~~~~~~ //
import { formatDate } from "../Utils/helpers";
import { flexCenter } from "../Utils/pageStyles";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import LocationSection from "./LocationSection";

export default function BottomSection({ isMobile, coupon }) {
  if (!coupon) {
    return null;
  }

  return (
    <Box>
      <Grid container>
        <Grid item xs={isMobile ? 12 : 10}>
          {/* ~~~~~ Location Menu ~~~~~ */}
          <Box sx={isMobile ? {} : flexCenter}>
            <LocationSection coupon={coupon} />
          </Box>
        </Grid>
        {/* ~~~~~ Expiration ~~~~~ */}
        {!isMobile ? (
          <Grid
            item
            xs={2}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            {coupon.expiration ? (
              <Typography variant="caption">
                Expires: {formatDate(coupon.expiration)}
              </Typography>
            ) : //   <Typography variant="caption">None set</Typography>
            null}
          </Grid>
        ) : null}
      </Grid>
    </Box>
  );
}
