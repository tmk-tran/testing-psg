import React, { useEffect, useState } from "react";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import {
  Backdrop,
  Modal,
  Box,
  Typography,
  TextField,
  Divider,
} from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { showSaveSweetAlert } from "../Utils/sweetAlerts";
import { lineDivider, modalHeaderStyle } from "../Utils/modalStyles";
import { capitalizeStateAbbr, capitalizeWords } from "../Utils/helpers";
// ~~~~~~~~~~~ Components ~~~~~~~~~~~ //
import ModalButtons from "../Modals/ModalButtons";

export default function DetailsEdit({
  isOpen,
  onClose,
  info,
  onSaveChanges, // --> FROM ContactDetails.jsx
  isMerchantTaskPage,
}) {
  // const [editedName, setEditedName] = useState(info.organization_name);
  // console.log(isOpen);
  // console.log(info);
  // console.log(info.merchant_name);
  const [editedName, setEditedName] = useState(
    !isMerchantTaskPage ? info.organization_name : info.merchant_name
  );
  console.log(editedName);
  const [editedType, setEditedType] = useState(info.type);
  const [editedAddress, setEditedAddress] = useState(info.address);
  const [editedCity, setEditedCity] = useState(info.city);
  const [editedState, setEditedState] = useState(info.state);
  const [editedZip, setEditedZip] = useState(info.zip);
  const [zipError, setZipError] = useState(false);
  const [contactFirstName, setContactFirstName] = useState(
    info.primary_contact_first_name
  );
  const [contactLastName, setContactLastName] = useState(
    info.primary_contact_last_name
  );
  const [contactPhone, setContactPhone] = useState(
    !isMerchantTaskPage ? info.primary_contact_phone : info.contact_phone_number
  );
  console.log(contactPhone);
  const [contactEmail, setContactEmail] = useState(
    !isMerchantTaskPage ? info.primary_contact_email : info.contact_email
  );
  console.log(contactEmail);

  useEffect(() => {
    setContactFirstName(info.primary_contact_first_name);
    setContactLastName(info.primary_contact_last_name);
    !isMerchantTaskPage
      ? setContactPhone(info.primary_contact_phone)
      : setContactPhone(info.contact_phone_number);
    !isMerchantTaskPage
      ? setContactEmail(info.primary_contact_email)
      : setContactEmail(info.contact_email);
  }, [info, isOpen]);

  const handleSave = () => {
    // Verification for zip code (assumes a 5 digit zip code)
    if (!/^\d{5}$/.test(editedZip)) {
      setZipError(true);
      return;
    }

    const detailsInfo = {
      ...info,
    };
    console.log(detailsInfo);

    const orgId = detailsInfo.organization_id;
    // console.log(orgId);
    const merchantId = detailsInfo.id;
    // console.log(merchantId);

    const editedDetails = !isMerchantTaskPage
      ? {
          organization_name: editedName,
          type: editedType,
          address: editedAddress,
          city: editedCity,
          state: editedState,
          zip: editedZip,
          primary_contact_first_name: contactFirstName,
          primary_contact_last_name: contactLastName,
          primary_contact_phone: contactPhone,
          primary_contact_email: contactEmail,
          organization_id: orgId,
        }
      : {
          merchant_name: editedName,
          address: editedAddress,
          city: editedCity,
          state: editedState,
          zip: editedZip,
          primary_contact_first_name: contactFirstName,
          primary_contact_last_name: contactLastName,
          contact_phone_number: contactPhone,
          contact_email: contactEmail,
          id: merchantId,
        };

    // Sweet Alert
    showSaveSweetAlert({ label: "Details Updated" });

    setZipError(false);

    onSaveChanges(editedDetails);
    onClose();
  };

  const handleReset = () => {
    // Reset form fields to their original values
    setEditedName(
      !isMerchantTaskPage ? info.organization_name : info.merchant_name
    );
    setEditedType(info.type);
    setEditedAddress(info.address);
    setEditedCity(info.city);
    setEditedState(info.state);
    setEditedZip(info.zip);
    setZipError(false);
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
          width: 400,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {!isMerchantTaskPage ? (
          <Typography variant="h6" sx={modalHeaderStyle}>
            Edit Organization Details
          </Typography>
        ) : (
          <Typography variant="h6" sx={modalHeaderStyle}>
            Edit Merchant Details
          </Typography>
        )}
        <Divider sx={lineDivider} />
        <TextField
          label="Name"
          value={capitalizeWords(editedName)}
          onChange={(e) => setEditedName(e.target.value)}
        />
        {!isMerchantTaskPage ? (
          <TextField
            label="Type"
            value={editedType}
            onChange={(e) => setEditedType(e.target.value)}
          />
        ) : null}
        <TextField
          label="Address"
          value={capitalizeWords(editedAddress)}
          onChange={(e) => setEditedAddress(e.target.value)}
        />
        {/* <div style={{ display: "flex", flexDirection: "row", gap: "3px" }}> */}
        <TextField
          label="City"
          value={capitalizeWords(editedCity)}
          onChange={(e) => setEditedCity(e.target.value)}
        />
        <TextField
          label="State"
          value={capitalizeStateAbbr(editedState)}
          onChange={(e) => setEditedState(e.target.value)}
        />
        <TextField
          label="Zip Code"
          type="tel"
          value={editedZip}
          onChange={(e) => {
            setEditedZip(e.target.value);
            setZipError(false);
          }}
          error={zipError}
          helperText={zipError ? "Invalid zip code" : ""}
        />
        {/* </div> */}
        <ModalButtons label="Save" onSave={handleSave} onCancel={handleClose} />
      </Box>
    </Modal>
  );
}
