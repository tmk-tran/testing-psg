import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
// ~~~~~~~~~~ Components ~~~~~~~~~~
import OrderSummaryTable from "./OrderSummaryTable";
import Typography from "../Typography/Typography";
import TotalUpdate from "./TotalUpdate";

export default function OrderSummaryDisplay({ customDonation }) {
  const location = useLocation();
  const selectedProducts = location.state?.selectedProducts ?? [];

  return (
    <>
      {/* Display order summary here */}
      {selectedProducts && selectedProducts.length > 0 ? (
        <>
          <OrderSummaryTable
            selectedProducts={selectedProducts}
            customDonation={customDonation}
            caseType="Summary"
          />
        </>
      ) : (
        <Typography
          label="No products in cart"
          gutterBottom
          sx={{ ml: 6, pt: 4 }}
        />
      )}
      <Box style={{ display: "flex", justifyContent: "flex-end" }}>
        <TotalUpdate
          selectedProducts={selectedProducts}
          customDonation={customDonation}
        />
      </Box>
    </>
  );
}
