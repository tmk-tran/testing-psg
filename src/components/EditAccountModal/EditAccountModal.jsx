import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  TextField,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import Swal from "sweetalert2";
import InputAdornment from "@mui/material/InputAdornment";
// ~~~~~~~~~~~ Hooks ~~~~~~~~~~~
import { modalHeaderStyle, lineDivider } from "../Utils/modalStyles";
import { capitalize, capitalizeStateAbbr } from "../Utils/helpers";
// ~~~~~~~~~~~ Components ~~~~~~~~~~~
import AddFileButton from "../AddFileButton/AddFileButton";
import StateSelector from "../StateSelector/StateSelector";
import ModalButtons from "../Modals/ModalButtons";

const EditAccountModal = ({ open, handleClose, data, isMerchantList }) => {
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth);
  const [editedAccount, setEditedAccount] = useState(data);
  const [selectedState, setSelectedState] = useState(data.state);

  useEffect(() => {
    setEditedAccount(data);
  }, [data]);

  const handleChange = (field, value, isMerchant) => {
    console.log(field, value, isMerchant);
    setEditedAccount((prev) => ({
      ...prev,
      [isMerchant ? "merchant_name" : field]: value,
    }));
  };

  const handleFileSelection = (uploadedFile) => {
    // console.log(uploadedFile);
    setEditedAccount({ ...editedAccount, uploadedFile });
  };

  const handleEditSave = (editedAccount) => {
    if (!isMerchantList) {
      dispatch({ type: "EDIT_ORGANIZATION", payload: {editedAccount: editedAccount} });
      dispatch({ type: "FETCH_ORGANIZATIONS", payload: auth });
    } else {
      dispatch({ type: "EDIT_MERCHANT_DETAILS", payload: {editedAccount: editedAccount} });
      dispatch({ type: "FETCH_MERCHANTS", payload: auth });
    }
    Swal.fire({
      icon: "success",
      title: "Account Successfully Edited!",
      showConfirmButton: false,
      timer: 1500, // Adjust the timer as needed
    });
    handleClose();
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "85%", // Adjusted width for smaller screens
    maxWidth: 600, // Maximum width for larger screens
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const editHeaderStyle = {
    ...lineDivider,
    mb: 5,
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {}}
        aria-labelledby="edit-account-modal"
        aria-describedby="form to edit account information"
      >
        <Box sx={style}>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~ MODAL HEADER ~~~~~~~~~~ */}
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          <Typography variant="h6" sx={modalHeaderStyle}>
            {!isMerchantList ? (
              <span>Edit Organization</span>
            ) : (
              <span>Edit Merchant</span>
            )}
          </Typography>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          <Divider sx={editHeaderStyle} />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          <Grid container spacing={2}>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~ ACCOUNT NAME ~~~~~~~~~~ */}
            <Grid item xs={!isMerchantList ? 5.5 : 12}>
              <TextField
                label={!isMerchantList ? "Organization Name" : "Merchant Name"}
                fullWidth
                value={
                  !isMerchantList
                    ? editedAccount.organization_name
                    : editedAccount.merchant_name
                }
                onChange={(e) =>
                  handleChange(
                    !isMerchantList ? "organization_name" : "merchant_name",
                    capitalize(e.target.value),
                    isMerchantList
                  )
                }
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~ ACCOUNT TYPE ORG ONLY) ~~~~~~~~~~ */}
            <Grid item xs={4}>
              {!isMerchantList && (
                <TextField
                  label="Organization Type"
                  fullWidth
                  value={editedAccount.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                />
              )}
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ ORG FEE ~~~~~~~~~~~~~~ */}
            <Grid item xs={2.5}>
              {!isMerchantList && (
                <TextField
                  type="number"
                  label="Fee"
                  fullWidth
                  value={editedAccount.organization_earnings}
                  onChange={(e) =>
                    handleChange("organization_earnings", e.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              )}
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ ADDRESS ~~~~~~~~~~~ */}
            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                value={capitalize(editedAccount.address)}
                onChange={(e) =>
                  handleChange("address", capitalize(e.target.value))
                }
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ CITY ~~~~~~~~~~~~~~ */}
            <Grid item xs={4}>
              <TextField
                label="City"
                fullWidth
                value={capitalize(editedAccount.city)}
                onChange={(e) =>
                  handleChange("city", capitalize(e.target.value))
                }
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ STATE ~~~~~~~~~~~~~~ */}
            <Grid item xs={4}>
              <StateSelector
                onChange={handleChange}
                stateSelected={capitalizeStateAbbr(selectedState)}
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~~ ZIP ~~~~~~~~~~~~~~ */}
            <Grid item xs={4}>
              <TextField
                label="Zip Code"
                fullWidth
                type="number"
                value={editedAccount.zip}
                onChange={(e) => handleChange("zip", e.target.value)}
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ LOGO ~~~~~~~~~~~~~~ */}
            <Grid item xs={12}>
              <AddFileButton
                filename={editedAccount.filename}
                onFileSelect={handleFileSelection}
              />
            </Grid>
          </Grid>
          <br />
          {/* ~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~ BUTTONS ~~~~~~ */}
          <ModalButtons
            label="Save"
            editedAccount={editedAccount}
            onSave={handleEditSave}
            onCancel={handleClose}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default EditAccountModal;
