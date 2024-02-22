import React, { useState } from "react";
import { Button, Snackbar, IconButton } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { primaryColor } from "../Utils/colors";

export default function CopyToClipboardExample({ copyToClipboard, caseType }) {
  console.log(caseType);
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    copyToClipboard();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* <Button onClick={handleCopy}>Copy Text</Button> */}
      <IconButton onClick={handleCopy} aria-label="copy to clipboard">
        <FileCopyIcon sx={{ color: primaryColor.color }} />
      </IconButton>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message="Text copied to clipboard"
        sx={{
          top: 10,
          ...(caseType === "Display" && { 
            // top: "10%",
            // right: "50%",
            // left: "20%",
            transform: "translate(240%, -3%)", // Center the Snackbar
 })
        }}
      />
    </>
  );
}
