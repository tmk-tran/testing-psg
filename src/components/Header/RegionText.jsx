import { Box, Typography } from "@mui/material";

export default function RegionText({ isMobile, sx, location, color }) {
  return (
    <Box sx={sx}>
      <Typography variant={isMobile ? "body2" : "h6"} sx={{ color: color }}>
        {location}
      </Typography>
    </Box>
  );
}
