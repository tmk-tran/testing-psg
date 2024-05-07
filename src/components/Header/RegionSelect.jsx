import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { headerMenuStyle } from "../AccountMenu/AccountMenu";

const RegionSelect = ({ isMobile, regions, onChange }) => {
  const activeRegion = regions.find((region) => region.active);
  const [value, setValue] = useState(activeRegion ? activeRegion.region_name : null);
  const [selectedRegionId, setSelectedRegionId] = useState(activeRegion ? activeRegion.id : "");
  console.log(selectedRegionId);


  const handleChange = (event) => {
    const newValue = event.target.value;
    console.log(newValue);
    setValue(newValue);
    const regionId = regions.find((region) => region.region_name === newValue)?.id;
    setSelectedRegionId(regionId);
    onChange(regionId);
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
        value={value || ""}
        onChange={handleChange}
        sx={{ color: "white", ...headerMenuStyle }}
      >
        {regions.map((region) => (
          <MenuItem key={region.id} value={region.region_name}>
            {region.region_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default RegionSelect;
