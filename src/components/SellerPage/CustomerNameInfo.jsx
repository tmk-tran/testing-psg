import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import { border } from "../Utils/colors";
import { flexCenter, flexEnd, flexRowSpace } from "../Utils/pageStyles";
import { showSaveSweetAlert } from "../Utils/sweetAlerts";

export default function CustomerNameInfo({ onSubmit, setShowOrderTable, pageLoad, setPageLoad }) {
  const seller = useParams();
  const refId = seller.refId;
  console.log(refId);
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showSkip, setShowSkip] = useState(true);

  // useEffect(() => {
  //   onFormChange({
  //     refId: refId,
  //     last_name: customerLastName,
  //     first_name: customerFirstName,
  //     phone: customerPhoneNumber
  //   });
  // }, [refId, customerLastName, customerFirstName, customerPhoneNumber]);

  // const handleLastName = (e) => setCustomerLastName(e.target.value);
  // const handleFirstName = (e) => setCustomerFirstName(e.target.value);
  // const handlePhoneNumber = (e) => {
  //   const value = e.target.value;
  //   if (!/^\d{0,10}$/.test(value)) {
  //     setPhoneNumberError("Phone number must be 10 digits long");
  //   } else {
  //     setPhoneNumberError("");
  //     setCustomerPhoneNumber(value);
  //   }
  // };

  const handleLastName = (e) => {
    setCustomerLastName(e.target.value);
    setShowSaveButton(
      e.target.value !== "" ||
        customerFirstName !== "" ||
        customerPhoneNumber !== ""
    );
  };

  const handleFirstName = (e) => {
    setCustomerFirstName(e.target.value);
    setShowSaveButton(
      customerLastName !== "" ||
        e.target.value !== "" ||
        customerPhoneNumber !== ""
    );
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
    setPhoneNumberError("");
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
      setPhoneNumberError("Phone number must be 10 digits long");
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
  };

  const skipClick = () => {
    setShowOrderTable(true);
    setShowSkip(false);
    setPageLoad(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography sx={{ textAlign: pageLoad ? "center" : "flex-start" }}>Customer information (optional):</Typography>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: pageLoad ? "column" : "row",
          justifyContent: pageLoad ? "center" : "flex-start",
          alignItems: pageLoad ? "center" : "flex-start",
        }}
      >
        <TextField
          value={customerLastName}
          fullWidth
          sx={{ width: pageLoad ? "50%" : "100%" }}
          label="Last Name"
          onChange={handleLastName}
          error={!!lastNameError}
          helperText={lastNameError}
        />
        <TextField
          value={customerFirstName}
          fullWidth
          sx={{ width: pageLoad ? "50%" : "100%" }}
          label="First Name"
          onChange={handleFirstName}
          error={!!firstNameError}
          helperText={firstNameError}
        />
        <TextField
          value={customerPhoneNumber}
          fullWidth
          sx={{ width: pageLoad ? "50%" : "100%" }}
          label="Phone Number"
          type="number"
          error={!!phoneNumberError}
          helperText={phoneNumberError}
          onChange={handlePhoneNumber}
        />

      </Box>
      <Box sx={pageLoad ? flexCenter : flexEnd}>
        {showSkip ? <Button onClick={skipClick}>Skip</Button> : null}
        {showSaveButton && (
          <Button variant="contained" color="secondary" type="submit">
            Save Customer Info
          </Button>
        )}
      </Box>
    </form>
  );
}
