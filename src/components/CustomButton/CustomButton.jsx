import React from "react";
import { Button, Tooltip } from "@mui/material";

export default function CustomButton({
  label,
  icon,
  onClick,
  variant,
  sx,
  disabled,
  fullWidth,
  Icon,
  title,
}) {
  return (
    <Tooltip title={title} placement="top">
      <Button
        startIcon={icon}
        variant={variant}
        onClick={onClick}
        sx={sx}
        disabled={disabled}
        fullWidth={fullWidth}
      >
        {label}
        {Icon && Icon}
      </Button>
    </Tooltip>
  );
}
