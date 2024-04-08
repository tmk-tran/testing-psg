import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const OrgMenu = ({ userId, organizations, defaultValue, onChange }) => {
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
    onChange(userId, newValue);
    setItemSelected(false);
  };

  return (
    <FormControl fullWidth sx={{ position: "relative" }}>
      {(!defaultValue || defaultValue === null) && itemSelected === false && (
        <InputLabel
          shrink={false}
          sx={{
            fontSize: "18px",
            ml: 2,
            lineHeight: "1.1",
            position: "absolute",
            top: "50%", // Move the label halfway down
            transform: "translateY(-50%)", //
          }}
        >
          Select Organization
        </InputLabel>
      )}
      <Select value={value} onChange={handleChange} sx={{ height: 40 }}>
        {organizations.map((org) => (
          <MenuItem key={org.id} value={org.id}>
            {org.organization_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default OrgMenu;
