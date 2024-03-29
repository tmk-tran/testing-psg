import React, { useEffect, useState } from "react";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import {
  Backdrop,
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import "./ContactEdit.css";
// ~~~~~~~~~~ Utils ~~~~~~~~~~
import {
  capitalizeFirstWord,
  formatPhoneNumber,
  validateEmail,
  validatePhoneNumber,
  validateWebsiteFormat,
} from "../Utils/helpers";
import { showSaveSweetAlert } from "../Utils/sweetAlerts";
import { showToast } from "../Utils/toasts";
import { lineDivider, modalHeaderStyle } from "../Utils/modalStyles";
import CloseButton from "../Buttons/CloseButton";
import { hoverAccept } from "../Utils/colors";
import { saveBtnWidth } from "../Utils/helpers";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import ModalButtons from "../Modals/ModalButtons";
import PhoneInput from "../LocationsCard/PhoneInput";

export default function ContactEdit({
  isOpen,
  onClose,
  info,
  onSaveChanges,
  isMerchantTaskPage,
}) {
  // const [name, setName] = useState(info.organization_name);
  console.log(isOpen);
  console.log(isMerchantTaskPage);
  const [name, setName] = useState(
    !isMerchantTaskPage ? info.organization_name : info.merchant_name
  );
  console.log(name);
  const [orgType, setOrgType] = useState(info.type);
  console.log(orgType);
  const [address, setAddress] = useState(info.address);
  console.log(address);
  const [city, setCity] = useState(info.city);
  console.log(city);
  const [state, setState] = useState(info.state);
  console.log(state);
  const [zip, setZip] = useState(info.zip);
  console.log(zip);
  const [editedFirstName, setEditedFirstName] = useState(
    info.primary_contact_first_name
  );
  console.log(editedFirstName);
  const [editedLastName, setEditedLastName] = useState(
    info.primary_contact_last_name
  );
  console.log(editedLastName);
  const [editedPhone, setEditedPhone] = useState(
    isMerchantTaskPage
      ? Number(info.contact_phone_number)
      : Number(info.primary_contact_phone)
  );
  console.log(editedPhone);
  const [phoneError, setPhoneError] = useState(false);
  console.log(phoneError);
  // const [editedEmail, setEditedEmail] = useState(info.primary_contact_email);
  const [editedEmail, setEditedEmail] = useState(
    !isMerchantTaskPage
      ? info.primary_contact_email || ""
      : info.contact_email || ""
  );
  console.log(editedEmail);
  const [emailError, setEmailError] = useState(false);
  console.log(emailError);
  console.log(name);
  const [editedWebsite, setEditedWebsite] = useState(info.website);
  console.log(editedWebsite);
  const [websiteError, setWebsiteError] = useState(false);

  useEffect(() => {
    setOrgType(info.type);
    setAddress(info.address);
    setCity(info.city);
    setState(info.state);
    setZip(info.zip);
    setEditedFirstName(info.primary_contact_first_name);
    setEditedLastName(info.primary_contact_last_name);
    !isMerchantTaskPage
      ? setEditedPhone(info.primary_contact_phone)
      : setEditedPhone(info.contact_phone_number);
    !isMerchantTaskPage
      ? setEditedEmail(info.primary_contact_email)
      : setEditedEmail(info.contact_email);
  }, [info, isMerchantTaskPage, isOpen]);

  const handleSave = () => {
    const contactInfo = {
      ...info,
    };
    console.log(contactInfo);

    const orgId = contactInfo.organization_id;
    console.log(orgId);
    const merchantId = contactInfo.id;
    console.log(merchantId);

    // Validate phone number before saving
    // if (!/^[0-9]*$/.test(editedPhone)) {
    //   setPhoneError(true);
    //   return;
    // }
    // if (!validatePhoneNumber(editedPhone)) {
    //   setPhoneError(true);
    //   return;
    // }

    if (!validateEmail(editedEmail)) {
      setEmailError(true);
      return; // Do not proceed with saving if email is invalid
    }

    if (editedWebsite && !validateWebsiteFormat(editedWebsite)) {
      setWebsiteError(true);
      return; // Do not proceed with saving if website is invalid
    }

    const editedItem = !isMerchantTaskPage
      ? {
          organization_id: orgId,
          organization_name: name,
          type: orgType,
          address: address,
          city: city,
          state: state,
          zip: zip,
          primary_contact_first_name: editedFirstName,
          primary_contact_last_name: editedLastName,
          primary_contact_phone: editedPhone,
          primary_contact_email: editedEmail,
        }
      : {
          id: merchantId,
          merchant_name: name,
          address: address,
          city: city,
          state: state,
          zip: zip,
          primary_contact_first_name: editedFirstName,
          primary_contact_last_name: editedLastName,
          contact_phone_number: editedPhone,
          contact_email: editedEmail,
          website: editedWebsite,
        };

    // from Utils
    // showToast();

    // Sweet Alert
    showSaveSweetAlert({ label: "Contact Updated" });

    // Clear email error if it was previously set
    setEmailError(false);
    // Clear phone number error if it was previously set
    setPhoneError(false);

    onSaveChanges(editedItem);
    console.log(editedItem);
  };

  const handleReset = () => {
    // Reset form fields to their original values
    setEditedFirstName(info.primary_contact_first_name);
    setEditedLastName(info.primary_contact_last_name);
    setEditedPhone(
      !isMerchantTaskPage
        ? info.primary_contact_phone
        : info.contact_phone_number
    );
    setEditedEmail(
      !isMerchantTaskPage ? info.primary_contact_email : info.contact_email
    );
    setEmailError(false);
    setPhoneError(false);
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
          width: 350,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* <CloseButton handleClose={handleClose} /> */}
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~ HEADER ~~~~~~~~ */}
        <Typography variant="h6" sx={modalHeaderStyle}>
          Edit Contact Info
        </Typography>
        <Divider sx={lineDivider} />
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~ FIRST NAME ~~~~~~~~ */}
        <TextField
          label="First Name"
          value={capitalizeFirstWord(editedFirstName)}
          onChange={(e) => setEditedFirstName(e.target.value)}
        />
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~ LAST NAME ~~~~~~~~ */}
        <TextField
          label="Last Name"
          value={capitalizeFirstWord(editedLastName)}
          onChange={(e) => setEditedLastName(e.target.value)}
        />
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~ PHONE ~~~~~~~~~~~ */}
        <PhoneInput
          phoneNumber={editedPhone}
          setPhoneNumber={setEditedPhone}
          sx={{ mb: 2 }}
          setPhoneError={setPhoneError}
          error={phoneError}
          helperText={phoneError ? "Please enter phone number" : ""}
        />

        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~ EMAIL ~~~~~~~~~~~ */}
        <TextField
          label="Email"
          type="email"
          value={editedEmail}
          onChange={(e) => {
            setEditedEmail(e.target.value);
            setEmailError(false); // Clear email error when typing
          }}
          error={emailError}
          helperText={
            emailError
              ? "Please enter a valid format (e.g., example@email.com)"
              : ""
          }
        />
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~ WEBSITE ~~~~~~~~~~ */}
        {isMerchantTaskPage ? (
          <TextField
            label="Website"
            value={editedWebsite}
            onChange={(e) => {
              setEditedWebsite(e.target.value);
              setWebsiteError(false);
            }}
            error={websiteError}
            helperText={
              websiteError
                ? "Please enter a valid format (e.g., www.example.com)"
                : ""
            }
          />
        ) : null}
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~ BUTTONS ~~~~~~~~~ */}
        <ModalButtons label="Save" onSave={handleSave} onCancel={onClose} />
      </Box>
    </Modal>
  );
}
