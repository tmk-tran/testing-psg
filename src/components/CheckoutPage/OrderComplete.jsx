import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
// ~~~~~~~~~ Hooks ~~~~~~~~~ //
import { centeredStyle } from "../Utils/pageStyles";
// ~~~~~~~~~ Components ~~~~~~~~~ //
import NewOrderButton from "./NewOrderButton";
import Typography from "../Typography/Typography";

export default function OrderComplete() {
  const seller = useParams();
  const refId = seller.refId;
  // Typography here is a custom component //
  return (
    <>
      <Box sx={centeredStyle}>
        <Typography
          label="Thank you for your purchase!"
          variant="h6"
          sx={{ mt: 10 }}
        />
        <Typography
          label="Your digital coupon book will be sent to: "
          variant="body2"
          sx={{ mt: 5, mb: 5 }}
        />
        <Typography
          label="You may now close this window, or..."
          variant="caption"
        />
      </Box>
      <Box
        sx={{
          mt: 3,
          ...centeredStyle,
        }}
      >
        <NewOrderButton refId={refId} />
      </Box>
    </>
  );
}
