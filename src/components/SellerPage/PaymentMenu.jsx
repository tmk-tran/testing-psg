import { useState } from "react";
import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
} from "@mui/material";

export default function PaymentMenu({
  isMobile,
  onPaymentSelect,
  hideCashCheck,
}) {
  const [payment, setPayment] = useState("");

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
          <MenuItem value="credit">Credit / Debit</MenuItem>
          <MenuItem value="payPal">PayPal</MenuItem>
          {!hideCashCheck && <MenuItem value="cash">Cash / Check</MenuItem>}
        </Select>
      </FormControl>
    </Box>
  );
}
