import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

const OrgMenu = ({ methods, defaultValue, onChange }) => {
  const [value, setValue] = useState(defaultValue);
  console.log(value);
  const [itemSelected, setItemSelected] = useState(false);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    console.log(newValue);
    setValue(newValue);
    setItemSelected(true);
    onChange(newValue);
    setItemSelected(false);
  };

  return (
    <FormControl sx={{ width: 190, position: "relative" }}>
      <InputLabel
        shrink={false}
        sx={{
          fontSize: "18px",
          ml: 2,
          lineHeight: "1.1",
          position: "absolute",
          top: "50%", // Move the label halfway down
          transform: "translateY(-50%)", // Center vertically
        }}
      >
        Select
      </InputLabel>
      <Select value={value} onChange={handleChange} sx={{ height: 30 }}>
        {methods.map((contactBy) => (
          <MenuItem key={contactBy} value={contactBy}>
            {contactBy}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default OrgMenu;
