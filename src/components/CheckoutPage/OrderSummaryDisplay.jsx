import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
// ~~~~~~~~~~ Components ~~~~~~~~~~
import OrderSummaryTable from "./OrderSummaryTable";
import Typography from "../Typography/Typography";
import TotalUpdate from "./TotalUpdate";

export default function OrderSummaryDisplay({ customDonation }) {
  const location = useLocation();
  const selectedProducts = location.state?.selectedProducts ?? [];
  // Access to selectedProducts and use in component
  console.log("Selected Products in CheckoutPage:", selectedProducts);
  const products = location.state?.rows ?? [];
  console.log("Products from previous page: ", products);
  console.log(customDonation);

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
          caseType="Order Confirmation"
        />
      </Box>
    </>
  );
}
