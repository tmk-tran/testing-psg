import React, { useState } from "react";
import { Box, Typography, TextField, Modal, Divider } from "@mui/material";
// ~~~~~~~~~~~ Hooks ~~~~~~~~~~~~~~~~~~~ //
import { lineDivider } from "../Utils/modalStyles";
import { dispatchHook } from "../../hooks/useDispatch";
import { showSaveSweetAlert } from "../Utils/sweetAlerts";
// ~~~~~~~~~~~ Components ~~~~~~~~~~~~~~ //
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

export default function BooksSoldForm({
  open,
  handleClose,
  orgId,
  editingRefId,
}) {
  const dispatch = dispatchHook();
  const [editedAmount, setEditedAmount] = useState(0);
  console.log(editedAmount);

  const handleAmountChange = (e) => {
    setEditedAmount(e.target.value);
  };

  const handleSubmit = () => {
    console.log(editedAmount);

    const valuesToSend = {
      refId: editingRefId,
      orgId: orgId,
      physical_book_cash: editedAmount,
      caseType: "edit",
    };

    const updateAction = {
      type: "UPDATE_BOOKS_SOLD",
      payload: valuesToSend,
    };
    console.log("Dispatching action:", updateAction);
    dispatch(updateAction);
    handleClose();
    showSaveSweetAlert();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Physical Books Sold
          </Typography>
          <Divider sx={lineDivider} />
          <Typography id="modal-modal-description" sx={{ mb: 2 }}>
            Please provide the total amount sold, through <strong>cash</strong>{" "}
            and/or <strong>check</strong> sales
          </Typography>
          <TextField
            label="Total"
            type="number"
            fullWidth
            onChange={handleAmountChange}
            sx={{ mb: 2 }}
          />
          <ModalButtons
            label="Update"
            onSave={handleSubmit}
            onCancel={handleClose}
          />
        </Box>
      </Modal>
    </div>
  );
}
