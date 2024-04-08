import React from "react";
import { Switch } from "@mui/material";

const ActionSwitch = ({ disabled, isChecked, onChange }) => {
  const handleChange = (event) => {
    const newValue = event.target.checked;
    onChange(newValue);
  };

  return (
    <Switch
      disabled={disabled}
      checked={isChecked}
      onChange={handleChange}
      inputProps={{
        "aria-label": "toggle graphic designer status",
      }}
      size="small"
    />
  );
};

export default ActionSwitch;
