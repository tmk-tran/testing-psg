import { Box } from "@mui/material";
import { flexCenter } from "../Utils/pageStyles";
import Typography from "../Typography/Typography";

export default function NoFile({ label, sx }) {
  return (
    <Box sx={{ ...sx, ...flexCenter }}>
      <Typography label={label} variant="caption" />
    </Box>
  );
}
