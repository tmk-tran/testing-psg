import React, { useEffect } from "react";
import { Typography } from "@mui/material";

export default function TotalUpdate({
  selectedProducts,
  customDonation,
  onChange = () => {},
  caseType,
}) {
  console.log(caseType);

  const total = selectedProducts.reduce(
    (acc, product) =>
      product.id === 4 || product.bookType === "Donate"
        ? acc + Number(customDonation)
        : acc + product.price * product.quantity,
    0
  );

  useEffect(() => {
    onChange(total);
  }, [selectedProducts, customDonation, onChange]);

  return (
    <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
      Order Total: ${total}
    </Typography>
  );
}
