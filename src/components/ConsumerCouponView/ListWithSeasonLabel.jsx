import { lazy } from "react";
import { Box, Divider, Typography } from "@mui/material";

const CouponCard = lazy(() => import("./CouponCard"));

const ListWithSeasonLabel = ({
  coupons,
  isMobile,
  nextSeasonYear,
  getCouponYear,
  startIdx,
}) => {
  // Check if at least one coupon on this page belongs to nextSeasonYear
  const hasNextSeason = coupons.some(
    (coupon) => getCouponYear(coupon)?.split("-")[1] === nextSeasonYear,
  );

  let newSeasonLabelRendered = false;

  return coupons.map((coupon, index) => {
    const isNewSeason = getCouponYear(coupon)?.split("-")[1] === nextSeasonYear;

    return (
      <Box key={coupon.id || startIdx + index} sx={{ width: "100%" }}>
        {hasNextSeason && !newSeasonLabelRendered && isNewSeason && (
          <>
            <Divider
              sx={{
                borderColor: "primary.main",
                width: { xs: "100%", sm: "50%" },
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{ textAlign: "center", display: "block", mb: 1 }}
            >
              Valid through September 1st, {nextSeasonYear}
            </Typography>
            {(newSeasonLabelRendered = true)}
          </>
        )}
        <CouponCard isMobile={isMobile} coupon={coupon} />
      </Box>
    );
  });
};

export default ListWithSeasonLabel;
