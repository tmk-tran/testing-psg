import { Typography } from "@mui/material";
import { highlightColor } from "../Utils/colors";

const highlighted = {
  ...highlightColor,
  borderRadius: 3,
  p: 1,
};
export default function RefIdDisplay({ seller }) {
  return (
    <Typography variant="h6" sx={{ textAlign: "center", ...highlighted }}>
      Referral ID: {seller.refId}
    </Typography>
  );
}
