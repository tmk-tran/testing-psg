import { useParams } from "react-router-dom";
import { Box, Typography as MuiTypography } from "@mui/material";
// ~~~~~~~~~ Hooks ~~~~~~~~~ //
import { centeredStyle } from "../Utils/pageStyles";
// ~~~~~~~~~ Components ~~~~~~~~~ //
import NewOrderButton from "./NewOrderButton";
import Typography from "../Typography/Typography";
import { customerList, digitalBookTypeSold } from "../../hooks/reduxStore";

export default function OrderComplete() {
  const seller = useParams();
  const refId = seller.refId;
  const customerEmail = customerList() || [];
  console.log(customerEmail);
  const digitalBookType = digitalBookTypeSold() || [];
  
  // Typography here is a custom component //
  // MuiTypography is MUI component //
  return (
    <>
      <Box sx={centeredStyle}>
        <Typography
          label="Thank you for your purchase!"
          variant="h6"
          sx={{ mt: 10 }}
        />
        {customerEmail.map((customer) => (
          <MuiTypography
            key={customer.email}
            variant="body2"
            sx={{ mt: 5, mb: 5 }}
          >
            Your digital coupon book will be sent to:{" "}
            <strong>{customer.email}</strong>
          </MuiTypography>
        ))}
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
