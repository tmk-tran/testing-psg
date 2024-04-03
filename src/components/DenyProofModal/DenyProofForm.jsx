import React from "react";
// ~~~~~~~~~~ Style ~~~~~~~~~~ //
import { Typography, TextField } from "@mui/material";
import {
  secondaryColor,
  errorColor,
  successColor,
  border,
} from "../Utils/colors";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import ErrorOutline from "../ErrorOutline/ErrorOutline";
import ModalButtons from "../Modals/ModalButtons";

const DenyProofForm = ({ onClose }) => {
  return (
    <div style={{ height: "100%" }}>
      {/* ~~~~~ Icon ~~~~~ */}
      <ErrorOutline />
      {/* ~~~~~ Input field ~~~~~ */}
      <Typography
        variant="h5"
        align="center"
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        Please Enter Reason
      </Typography>
      <TextField
        multiline
        rows={4}
        fullWidth
        label="Comments or coupon changes here..."
        variant="outlined"
        sx={{ mt: 2, mb: 2 }}
      />
      {/* ~~~~~ Buttons ~~~~~ */}
      <ModalButtons label="Submit" onCancel={onClose} />
    </div>
  );
};

export default DenyProofForm;
