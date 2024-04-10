import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

const RegionSelect = ({ regions, defaultValue, onChange }) => {
  const [value, setValue] = useState(defaultValue);
  console.log(value);

  const handleChange = (event) => {
    const newValue = event.target.value;
    console.log(newValue);
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <FormControl sx={{ width: 190, position: "relative" }}>
      {!defaultValue && (
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
      )}
      <Select value={value} onChange={handleChange} sx={{ height: 30 }}>
        {regions.map((region) => (
          <MenuItem key={region} value={region}>
            {region}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default RegionSelect;
