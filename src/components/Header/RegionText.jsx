import { Box, Typography } from "@mui/material";

export default function RegionText({ sx, location, color }) {
  return (
    <Box sx={sx}>
      <Typography variant="h6" sx={{ color: color }}>
        {location}
      </Typography>
    </Box>
  );
}
