import React from "react";
import { Box, Typography, Modal } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { dispatchHook } from "../../hooks/useDispatch";
import { showSaveSweetAlert } from "../Utils/sweetAlerts";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import ErrorOutline from "../ErrorOutline/ErrorOutline";
import ModalButtons from "../Modals/ModalButtons";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const typographyStyle = {
  textAlign: "center",
  mt: 2,
  mb: 3,
  fontSize: "24px",
};

export default function ConfirmNewYearModal({
  selectedYearId,
  yearSelected,
  setYearSelected,
  modalOpen,
  setModalOpen,
}) {
  const dispatch = dispatchHook();

  const handleSave = () => {
    if (yearSelected) {
      console.log(yearSelected);
      const dispatchAction = {
        type: "SET_ACTIVE_YEAR",
        payload: selectedYearId,
      };
      console.log(dispatchAction);
      dispatch(dispatchAction);
    }
    setModalOpen(false);
    showSaveSweetAlert({ label: "Active Book Year Set" });
  };

  const handleCancel = () => {
    setYearSelected(null);
    setModalOpen(false);
  };

  return (
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
      <Box sx={style}>
        {/* ~~~~~ Icon ~~~~~ */}
        <ErrorOutline />
        <Typography sx={typographyStyle}>
          Proceeding will set <strong>{yearSelected}</strong> as the active book
          year. Do you confirm?
        </Typography>
        {/* ~~~~~~ Buttons ~~~~~~ */}
        <ModalButtons
          label="Confirm"
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </Box>
    </Modal>
  );
}
