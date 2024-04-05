import React from "react";
import { Switch } from "@mui/material";

const ActionSwitch = ({ isChecked, onChange }) => {
  const handleChange = (event) => {
    const newValue = event.target.checked;
    onChange(newValue);
  };

  return (
    <Switch
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
