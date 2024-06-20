import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import { primaryColor } from "../Utils/colors";

const ActionButton = ({
  title,
  Icon,
  buttonSx,
  iconSx,
  onClick,
  onMouseOver,
  onMouseOut,
  disabled,
}) => {
  return (
    <IconButton
      aria-label="launch"
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      sx={{
        // fontSize: "larger",
        height: "25px",
        width: "25px",
        color: primaryColor.color,
        "&:hover": {
          color: "#325CAB",
          transition: "transform 0.2s",
          cursor: "pointer",
        },
        ...(disabled && {
          opacity: 0.5, // Gray out the button when disabled
          pointerEvents: "none", // Disable pointer events
        }),
        ...buttonSx,
      }}
      disabled={disabled}
    >
      <Tooltip title={title}>
        <Icon sx={iconSx} />
      </Tooltip>
    </IconButton>
  );
};

export default ActionButton;
