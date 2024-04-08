import React from "react";
import { Typography as MuiTypography } from "@mui/material";
import { Link } from "react-router-dom";

const Typography = ({ customKey, label, sx, variant, gutterBottom, to, newTab, icon }) => {
  console.log(newTab);
  if (to) {
    return (
      <MuiTypography
        component={Link}
        to={to}
        target={newTab ? "_blank" : ""}
        sx={sx}
        variant={variant}
        gutterBottom={gutterBottom}
      >
        {label}
      </MuiTypography>
    );
  }

  return (
    <MuiTypography key={customKey} sx={sx} variant={variant} gutterBottom={gutterBottom}>
      {icon && icon} {label}
    </MuiTypography>
  );
};

export default Typography;
