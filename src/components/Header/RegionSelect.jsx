import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { headerMenuStyle } from "../AccountMenu/AccountMenu";

const RegionSelect = ({ isMobile, regions, defaultValue, onChange }) => {
  const [value, setValue] = useState(defaultValue ? defaultValue : null);
  console.log(value);

  const handleChange = (event) => {
    const newValue = event.target.value;
    console.log(newValue);
    setValue(newValue);
    // onChange(newValue);
  };

  return (
    <FormControl sx={{ width: 190, position: "relative" }}>
      {/* {!defaultValue && ( */}
      {!value && (
        <InputLabel
          shrink={false}
          sx={{
            fontSize: "0.8rem",
            ml: 2,
            position: "absolute",
            top: "40%", // Move the label halfway down
            transform: "translateY(-50%)", // Center vertically
            color: "white",
          }}
        >
          Select Region
        </InputLabel>
      )}
      <Select
        value={value}
        onChange={handleChange}
        sx={{ color: "white", ...headerMenuStyle }}
      >
        {regions.map((region) => (
          <MenuItem key={region.id} value={region.id}>
            {region.region_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default RegionSelect;
