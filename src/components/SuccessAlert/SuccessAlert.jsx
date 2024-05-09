import React from "react";
import { Alert, Snackbar } from "@mui/material";

export default function SuccessAlert({ isOpen, onClose, caseType }) {
  let anchorOrigin = { vertical: "top", horizontal: "center" };

  // Set different anchor origins based on caseType
  if (caseType === "CompletedCoupon") {
    anchorOrigin = { vertical: "bottom", horizontal: "center" };
  }

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3000}
      onClose={onClose}
      // anchorOrigin={{ vertical: "top", horizontal: "center" }} // Set the position to top-center
      anchorOrigin={anchorOrigin}
    >
      {caseType === "NewTask" ? (
        <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
          New Task Created!
        </Alert>
      ) : caseType === "NewComment" ? (
        <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
          New Comment Added!
        </Alert>
      ) : caseType === "CompletedCoupon" ? (
        <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
          Coupon Task Complete!
        </Alert>
      ) : caseType === "Archived" ? (
        <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
          Task has been successfully archived!
        </Alert>
      ) : caseType === "Cash" ? (
        <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
          Cash Updated!
        </Alert>
      ) : caseType === "Checks" ? (
        <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
          Checks Updated!
        </Alert>
      ) : caseType === "Donations" ? (
        <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
          Donations Updated!
        </Alert>
      ) : caseType === "Assigned" ? (
        <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
          Task Assignment Updated!
        </Alert>
      ) : (
        <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
          Task has been successfully updated!
        </Alert>
      )}
    </Snackbar>
  );
}
