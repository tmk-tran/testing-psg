import React, { useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { InputLabel } from "@mui/material";

export default function BasicDatePicker({ initialDate, onChange}) {
  const [date, setDate] = useState(initialDate);
  console.log(date);
  const logDate = date.$d;
  console.log(logDate);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    // Pass the selected date to the parent component using the onDateChange prop
    onChange(newDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <InputLabel>Due:</InputLabel>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          // label="Date"
          // value={date}
          onChange={handleDateChange}
          slotProps={{
            textField: { placeholder: "Date Here...", sx: { width: "100%" } },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
