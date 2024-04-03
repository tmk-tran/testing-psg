import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { flexCenter, flexEnd, flexRowSpace } from "../Utils/pageStyles";
import { showSaveSweetAlert } from "../Utils/sweetAlerts";
import PhoneInput from "../LocationsCard/PhoneInput";

export default function CustomerNameInfo({
  onSubmit,
  setShowOrderTable,
  pageLoad,
  setPageLoad,
}) {
  const seller = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const refId = seller.refId;
  console.log(refId);
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showSkip, setShowSkip] = useState(true);
  const [customerInfoSubmitted, setCustomerInfoSubmitted] = useState(false);
  console.log(customerInfoSubmitted);

  const handleLastName = (e) => {
    setCustomerLastName(e.target.value);
    setShowSaveButton(
      e.target.value !== "" ||
        customerFirstName !== "" ||
        customerPhoneNumber !== ""
    );
    setLastNameError(false);
  };

  const handleFirstName = (e) => {
    setCustomerFirstName(e.target.value);
    setShowSaveButton(
      customerLastName !== "" ||
        e.target.value !== "" ||
        customerPhoneNumber !== ""
    );
    setFirstNameError(false);
  };

  const handlePhoneNumber = (e) => {
    const value = e.target.value;
    if (!/^\d{0,10}$/.test(value)) {
      setPhoneNumberError("Phone number must be 10 digits long");
    } else {
      setPhoneNumberError("");
      setCustomerPhoneNumber(value);
      setShowSaveButton(
        customerLastName !== "" || customerFirstName !== "" || value !== ""
      );
    }
  };

  const resetForm = () => {
    setCustomerLastName("");
    setCustomerFirstName("");
    setCustomerPhoneNumber("");
    setLastNameError("");
    setFirstNameError("");
    setPhoneNumberError(false);
    setShowSaveButton(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerLastName.trim()) {
      setLastNameError("Last Name cannot be empty");
      return;
    }
    if (!customerFirstName.trim()) {
      setFirstNameError("First Name cannot be empty");
      return;
    }
    if (!customerPhoneNumber || customerPhoneNumber.length !== 10) {
      setPhoneNumberError(true);
      return;
    }
    // Call your submit function here
    console.log(
      "Submitting form with info:",
      refId,
      customerLastName,
      customerFirstName,
      customerPhoneNumber
    );

    onSubmit({
      refId: refId,
      last_name: customerLastName,
      first_name: customerFirstName,
      phone: customerPhoneNumber,
    });
    resetForm();
    showSaveSweetAlert({ label: null });
    setCustomerInfoSubmitted(true);
    setShowOrderTable(true);
  };

  const skipClick = () => {
    setShowOrderTable(true);
    setShowSkip(false);
    setPageLoad(false);
  };

  return (
    <>
      {!customerInfoSubmitted ? (
        <form onSubmit={handleSubmit}>
          <Typography sx={{ textAlign: pageLoad ? "center" : "flex-start" }}>
            Customer information (optional):
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: isMobile ? "column" : pageLoad ? "column" : "row",
              justifyContent: pageLoad ? "center" : "flex-start",
              alignItems: pageLoad ? "center" : "flex-start",
            }}
          >
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~ First Name ~~~~~~~~~ */}
            <TextField
              value={customerFirstName}
              fullWidth
              sx={{ width: pageLoad ? (isMobile ? "100%" : "50%") : "100%" }}
              label="First Name"
              onChange={handleFirstName}
              error={!!firstNameError}
              helperText={firstNameError}
            />
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~ Last Name ~~~~~~~~~ */}
            <TextField
              value={customerLastName}
              fullWidth
              sx={{ width: pageLoad ? (isMobile ? "100%" : "50%") : "100%" }}
              label="Last Name"
              onChange={handleLastName}
              error={!!lastNameError}
              helperText={lastNameError}
            />
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~ Phone Number ~~~~~~~~~~ */}
            <PhoneInput
              phoneNumber={customerPhoneNumber}
              setPhoneNumber={setCustomerPhoneNumber}
              sx={{ width: pageLoad ? (isMobile ? "100%" : "50%") : "100%" }}
              setPhoneError={setPhoneNumberError}
              error={phoneNumberError}
              helperText={
                phoneNumberError ? "Phone number must be 10 digits" : ""
              }
            />
          </Box>
          <Box sx={pageLoad ? flexCenter : flexEnd}>
            {showSkip ? (
              <Button onClick={skipClick} sx={{ mt: 2 }}>
                Skip
              </Button>
            ) : null}
            {showSaveButton && (
              <Button variant="contained" color="secondary" type="submit">
                Save Customer Info
              </Button>
            )}
          </Box>
        </form>
      ) : null}
    </>
  );
}
