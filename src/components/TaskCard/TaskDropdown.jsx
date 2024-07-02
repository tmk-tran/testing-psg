import React, { useEffect, useState } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const taskOptions = ["New", "In Progress", "Complete"];

export default function TaskDropdown({ onChange, taskStatus }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    setStatus(taskStatus);
  }, [taskStatus]);

  const handleMenuChange = (event) => {
    const choice = event.target.value;
    setStatus(choice);

    // Call the onChange callback with the selected task
    onChange(choice);
  };

  return (
    <FormControl>
      <InputLabel sx={{ mt: 1 }}>Status</InputLabel>
      <Select
        value={status}
        onChange={handleMenuChange}
        displayEmpty
        sx={{ width: "10vw", mt: 3 }}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "bottom",
          },
          transformOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          getContentAnchorEl: null,
        }}
      >
        <MenuItem value="" disabled>
          Move Task...
        </MenuItem>
        {taskOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
