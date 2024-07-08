import React, { useState } from "react";
import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
} from "@mui/material";

export default function PaymentMenu({ isMobile, onPaymentSelect }) {
  const [payment, setPayment] = useState("");
  console.log(payment);

  const handleChange = (event) => {
    setPayment(event.target.value);
    onPaymentSelect(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120, width: isMobile ? "100%" : "40%" }}>
      <Typography sx={{ mb: 1, ...(isMobile && { textAlign: "center" }) }}>
        Please choose a method of payment:
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="payment-menu-label">Payment</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="payment-select"
          value={payment}
          label="Payment"
          onChange={handleChange}
        >
          <MenuItem value="cash">Cash / Check</MenuItem>
          <MenuItem value="payPal">PayPal</MenuItem>
          <MenuItem value="credit">Credit / Debit</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
