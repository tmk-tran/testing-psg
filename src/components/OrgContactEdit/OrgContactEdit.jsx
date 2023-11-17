import React, { useEffect, useState } from "react";
// Style
import {
  Backdrop,
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import "./OrgContactEdit.css";
// Utils
import { formatPhoneNumber, modalBtnStyle } from "../Utils/helpers";
// Toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OrgContactEdit({
  isOpen,
  onClose,
  info,
  onSaveChanges,
}) {
  const [orgName, setOrgName] = useState(info.organization_name);
  const [orgType, setOrgType] = useState(info.type);
  const [orgAddress, setOrgAddress] = useState(info.address);
  const [orgCity, setOrgCity] = useState(info.city);
  const [orgState, setOrgState] = useState(info.state);
  const [orgZip, setOrgZip] = useState(info.zip);
  const [editedFirstName, setEditedFirstName] = useState(
    info.primary_contact_first_name
  );
  const [editedLastName, setEditedLastName] = useState(
    info.primary_contact_last_name
  );
  const [editedPhone, setEditedPhone] = useState(info.primary_contact_phone);
  const [editedEmail, setEditedEmail] = useState(info.primary_contact_email);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    setOrgName(info.organization_name);
    setOrgType(info.type);
    setOrgAddress(info.address);
    setOrgCity(info.city);
    setOrgState(info.state);
    setOrgZip(info.zip);
  }, [info]);

  const handleSave = () => {
    // Validate email before saving
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedEmail)) {
      setEmailError(true);
      return; // Do not proceed with saving if email is invalid
    }

    // Clear email error if it was previously set
    setEmailError(false);

    const contactInfo = {
      ...info,
      organization_name: orgName,
      type: orgType,
      address: orgAddress,
      city: orgCity,
      state: orgState,
      zip: orgZip,
      primary_contact_first_name: editedFirstName,
      primary_contact_last_name: editedLastName,
      primary_contact_phone: editedPhone,
      primary_contact_email: editedEmail,
    };

    const orgId = contactInfo.organization_id;
    console.log("ORG ID = ", orgId);

    const editedItem = {
      organization_id: orgId,
      organization_name: orgName,
      type: orgType,
      address: orgAddress,
      city: orgCity,
      state: orgState,
      zip: orgZip,
      primary_contact_first_name: editedFirstName,
      primary_contact_last_name: editedLastName,
      primary_contact_phone: editedPhone,
      primary_contact_email: editedEmail,
      organization_id: orgId,
    };

    toast.success("Changes saved successfully!", {
      position: toast.POSITION.RIGHT_CENTER,
      autoClose: 3000,
      closeButton: false,
      hideProgressBar: true,
    });

    onSaveChanges(editedItem);
  };

  const handleReset = () => {
    // Reset form fields to their original values
    setEditedFirstName(info.primary_contact_first_name);
    setEditedLastName(info.primary_contact_last_name);
    setEditedPhone(info.primary_contact_phone);
    setEditedEmail(info.primary_contact_email);
    setEmailError(false); // Clear email error on reset
  };

  const handleClose = () => {
    handleReset(); // Reset form fields before closing
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {}} // Prevent closing on backdrop click
      aria-labelledby="org-contact-edit-modal"
      aria-describedby="org-contact-edit-modal-description"
      BackdropComponent={Backdrop}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{ p: 2, textAlign: "center", fontWeight: "bold" }}
        >
          Edit Contact Information
        </Typography>
        <TextField
          label="First Name"
          value={editedFirstName}
          onChange={(e) => setEditedFirstName(e.target.value)}
        />
        <TextField
          label="Last Name"
          value={editedLastName}
          onChange={(e) => setEditedLastName(e.target.value)}
        />
        <TextField
          label="Phone"
          value={formatPhoneNumber(editedPhone)}
          onChange={(e) => setEditedPhone(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          value={editedEmail}
          onChange={(e) => {
            setEditedEmail(e.target.value);
            setEmailError(false); // Clear email error when typing
          }}
          error={emailError}
          helperText={emailError ? "Invalid email format" : ""}
        />
        <div style={modalBtnStyle}
          // style={{
          //   display: "flex",
          //   flexDirection: "row",
          //   justifyContent: "space-between",
          // }}
        >
          <Button className="modal-cancel-btn" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </Box>
    </Modal>
  );
}
