import React from "react";
import { Box, Button, Typography, Modal, Divider } from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { flexRowSpace } from "../Utils/pageStyles";
import { primaryColor } from "../Utils/colors";

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

const buttonWidth = {
  width: "25%",
};

export default function BasicModal({ open, handleClose, submitOrder }) {
  const handleCash = () => {
    submitOrder("cash");
    handleClose();
  };

  const handleCheck = () => {
    submitOrder("checks");
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="cash-check-selector"
      aria-describedby="provides two options. check or cash"
    >
      <Box sx={style}>
        <CancelPresentationIcon
          sx={{
            color: primaryColor.color,
            "&:hover": {
              color: "red",
            },
          }}
          onClick={handleClose}
        />
        <Typography variant="h6" sx={{ mt: 5, textAlign: "center" }}>
          Select a payment method:
        </Typography>
        <Box sx={{ minHeight: 50 }}></Box>
        <Box sx={flexRowSpace}>
          <Button variant="contained" sx={buttonWidth} onClick={handleCheck}>
            Check
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={buttonWidth}
            onClick={handleCash}
          >
            Cash
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
