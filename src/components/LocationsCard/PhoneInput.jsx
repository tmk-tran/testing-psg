import React, { useState } from "react";
import TextField from "@mui/material/TextField";

const PhoneInput = ({ phoneNumber, setPhoneNumber, sx, setPhoneError, error, helperText }) => {
  const [isTyping, setIsTyping] = useState(false);
  const formattedPhoneNumber = isTyping
    ? `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
        3,
        6
      )}-${phoneNumber.slice(6)}`
    : "";

  const handlePhoneNumberChange = (event) => {
    const input = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters

    if (input.length <= 10) {
      setPhoneNumber(input); // Update parent state with the unformatted number
      setIsTyping(true);
      setPhoneError(false);
    }
  };

  return (
    <TextField
      label="Phone Number"
      variant="outlined"
      value={formattedPhoneNumber}
      onChange={handlePhoneNumberChange}
      fullWidth
      sx={sx}
      required
      error={error}
      helperText={helperText}
    />
  );
};

export default PhoneInput;
