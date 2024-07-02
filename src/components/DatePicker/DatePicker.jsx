import React, { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { InputLabel } from "@mui/material";

export default function BasicDatePicker({
  initialDate,
  onChange,
  hideInputLabel,
}) {
  const [date, setDate] = useState(initialDate);
  if (date) {
    const logDate = date.$d;
  }

  const handleDateChange = (newDate) => {
    setDate(newDate);
    // Pass the selected date to the parent component using the onDateChange prop
    onChange(newDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {hideInputLabel ? null : <InputLabel>Due:</InputLabel>}
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          // label="Date"
          // value={date}
          onChange={handleDateChange}
          slotProps={{
            textField: { placeholder: "Date Due...", sx: { width: "100%" } },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
