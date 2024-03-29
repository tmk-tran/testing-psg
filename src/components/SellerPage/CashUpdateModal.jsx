import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ModalButtons from "../Modals/ModalButtons";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const addIconStyle = {
  mr: 1,
  fontSize: "larger",
};

export default function CashUpdateModal({
  caseType,
  updateSellerInfo,
  handleCaseTypeChange,
}) {
  console.log(caseType);
  const [open, setOpen] = useState(false);
  const [cashAmount, setCashAmount] = useState(0);
  const [checksAmount, setChecksAmount] = useState(0);
  const [donationsAmount, setDonationsAmount] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCashAmountChange = (e) => {
    setCashAmount(e.target.value);
  };

  const handleChecksUpdate = (e) => {
    setChecksAmount(e.target.value);
  };

  const handleDonationsUpdate = (e) => {
    setDonationsAmount(e.target.value);
  };

  // Reset the form for the specific type
  const resetForm = (type) => {
    switch (type) {
      case "Cash":
        setCashAmount(0);
        break;
      case "Checks":
        setChecksAmount(0);
        break;
      case "Donations":
        setDonationsAmount(0);
        break;
      default:
        break;
    }
    handleClose();
  };

  const handleSubmit = () => {
    console.log(
      "Amounts submitted:",
      cashAmount,
      checksAmount,
      donationsAmount
    );
    console.log(caseType);

    switch (caseType) {
      case "Cash":
        updateSellerInfo(caseType, cashAmount);
        break;
      case "Checks":
        updateSellerInfo(caseType, checksAmount);
        break;
      case "Donations":
        updateSellerInfo(caseType, donationsAmount);
        break;
      default:
        break;
    }
    handleCaseTypeChange(caseType);
    resetForm(caseType);
    handleClose(); // Close the modal after submission
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Button
        variant="contained"
        sx={{ margin: ".5rem 0", width: "300px", lineHeight: "1.5rem" }}
        onClick={handleOpen}
      >
        {(() => {
          switch (caseType) {
            case "Cash":
              return (
                <>
                  <AddCircleIcon sx={addIconStyle} />
                  Cash
                </>
              );
            case "Checks":
              return (
                <>
                  <AddCircleIcon sx={addIconStyle} />
                  Checks
                </>
              );
            case "Donations":
              return (
                <>
                  <AddCircleIcon sx={addIconStyle} />
                  Donations
                </>
              );
            default:
              return "";
          }
        })()}
      </Button>
      <Modal open={open} onClose={() => {}}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {(() => {
              switch (caseType) {
                case "Cash":
                  return "Cash Update";
                case "Checks":
                  return "Checks Update";
                case "Donations":
                  return "Donations Update";
                default:
                  return "";
              }
            })()}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {caseType === "Cash" &&
              "Please enter the amount of cash collected for coupon book sale(s)"}
            {caseType === "Checks" &&
              "Please enter the amount of checks collected for coupon book sale(s)"}
            {caseType === "Donations" &&
              "Please enter the amount of cash donations collected for coupon book sale(s)"}
          </Typography>

          <TextField
            type="number"
            inputProps={{ min: "0" }}
            label={
              caseType === "Cash"
                ? "Cash Amount"
                : caseType === "Checks"
                ? "Checks Amount"
                : caseType === "Donations"
                ? "Donations Amount"
                : ""
            }
            variant="outlined"
            value={
              caseType === "Cash"
                ? cashAmount
                : caseType === "Checks"
                ? checksAmount
                : caseType === "Donations"
                ? donationsAmount
                : ""
            }
            onChange={
              caseType === "Cash"
                ? handleCashAmountChange
                : caseType === "Checks"
                ? handleChecksUpdate
                : caseType === "Donations"
                ? handleDonationsUpdate
                : null
            }
            fullWidth
            sx={{ mt: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          <ModalButtons
            label="Submit"
            width="50%"
            sx={{ mt: 3 }}
            onSave={handleSubmit}
            onCancel={resetForm}
            caseType="moneyUpdate"
          />
        </Box>
      </Modal>
    </div>
  );
}
