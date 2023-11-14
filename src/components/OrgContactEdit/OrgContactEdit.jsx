import React, { useState } from "react";
// Style
import {
  Backdrop,
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
// Utils
import { formatPhoneNumber } from "../Utils/helpers";

export default function OrgContactEdit({
  isOpen,
  onClose,
  info,
  onSaveChanges,
}) {
  const [editedFirstName, setEditedFirstName] = useState(
    info.primary_contact_first_name
  );
  const [editedLastName, setEditedLastName] = useState(
    info.primary_contact_last_name
  );
  const [editedPhone, setEditedPhone] = useState(info.primary_contact_phone);
  const [editedEmail, setEditedEmail] = useState(info.primary_contact_email);

  const handleSave = () => {
    const newContactInfo = {
      ...info,
      primary_contact_first_name: editedFirstName,
      primary_contact_last_name: editedLastName,
      primary_contact_phone: editedPhone,
      primary_contact_email: editedEmail,
    };

    const orgId = newContactInfo.organization_id;
    console.log("ORG ID = ", orgId);

    const editedItem = {
      organization_id: orgId,
      primary_contact_first_name: editedFirstName,
      primary_contact_last_name: editedLastName,
      primary_contact_phone: editedPhone,
      primary_contact_email: editedEmail,
    };

    onSaveChanges(editedItem);
  };

  const handleReset = () => {
    // Reset form fields to their original values
    setEditedFirstName(info.primary_contact_first_name);
    setEditedLastName(info.primary_contact_last_name);
    setEditedPhone(info.primary_contact_phone);
    setEditedEmail(info.primary_contact_email);
  };

  const handleClose = () => {
    handleReset(); // Reset form fields before closing
    onClose();
  };

  return (
    // <Modal
    //   open={isOpen}
    //   onClose={onClose}
    //   aria-labelledby="org-contact-edit-modal"
    //   aria-describedby="org-contact-edit-modal-description"
    // >
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
        <Typography variant="h6">Edit Contact Information</Typography>
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
          value={editedEmail}
          onChange={(e) => setEditedEmail(e.target.value)}
        />
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </Box>
    </Modal>
  );
}
