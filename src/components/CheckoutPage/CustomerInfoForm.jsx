import React, { useState } from "react";
import { Box, Grid, TextField } from "@mui/material";
import StateSelector from "../StateSelector/StateSelector";
import Typography from "../Typography/Typography";
import { border } from "../Utils/colors";
import { flexRowSpace } from "../Utils/pageStyles";
import { capitalizeWords } from "../Utils/helpers";

export default function CustomerInfoForm({
  handleStateChange,
  isSubmitted,
  errors,
  setErrors,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  address,
  setAddress,
  unit,
  setUnit,
  city,
  setCity,
  stateSelected,
  setStateSelected,
  zip,
  setZip,
}) {
  // // ~~~~~~~~~~ Form state ~~~~~~~~~~ //
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState("");
  // const [phone, setPhone] = useState("");
  // const [address, setAddress] = useState("");
  // const [unit, setUnit] = useState("");
  // const [city, setCity] = useState("");
  // const [zip, setZip] = useState("");
  // console.log(firstName);
  // console.log(lastName);
  // console.log(email);
  // console.log(phone);
  // console.log(address);
  // console.log(unit);
  // console.log(city);
  // console.log(stateSelected);
  // console.log(zip);
  // ~~~~~ Error State ~~~~~ //
  // const [stateError, setStateError] = useState(false);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setUnit("");
    setCity("");
    setStateSelected(false);
    setZip("");
  };

  return (
    <div style={{ width: "90%", margin: "0 auto", padding: 5 }}>
      {/* ~~~~~~~~~~ Header ~~~~~~~~~~~~~~ */}
      <Box sx={flexRowSpace}>
        <Typography label="Customer Information" variant="h6" sx={{ mt: 2 }} />
        <Typography
          label="*Required fields"
          variant="caption"
          sx={{ mt: 4, fontWeight: "bold" }}
        />
      </Box>
      <hr />
      <form style={{ marginTop: 22 }}>
        <Grid container spacing={2}>
          {/* ~~~~~~~~~~ First Name ~~~~~~~~~~~~~~~~~ */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              value={capitalizeWords(firstName)}
              onChange={(e) => {
                setFirstName(e.target.value);
                setErrors((prevErrors) => {
                  return { ...prevErrors, firstName: "" };
                });
              }}
              variant="outlined"
              fullWidth
              required
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>
          {/* ~~~~~~~~~~ Last Name ~~~~~~~~~~~~~~~~~ */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              value={capitalizeWords(lastName)}
              onChange={(e) => {
                setLastName(e.target.value);
                setErrors((prevErrors) => {
                  return { ...prevErrors, lastName: "" };
                });
              }}
              variant="outlined"
              fullWidth
              required
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>
          {/* ~~~~~~~~~~~~~ Email ~~~~~~~~~~~~~~~~~~ */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prevErrors) => {
                  return { ...prevErrors, email: "" };
                });
              }}
              variant="outlined"
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          {/* ~~~~~~~~~ Phone Number ~~~~~~~~~~~~~~~ */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setErrors((prevErrors) => {
                  return { ...prevErrors, phone: "" };
                });
              }}
              variant="outlined"
              fullWidth
              required
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ Shipping Address ~~~~~~~~~~ */}
          <Grid item xs={12}>
            <Typography label="Address" variant="h6" />
            <hr />
          </Grid>
          {/* <Divider sx={{ ml: 3, ...lineDivider}} /> */}
          {/* ~~~~~~~~~~ Address ~~~~~~~~~~~~~~~~~~~~ */}
          <Grid item xs={8}>
            <TextField
              label="Address"
              value={capitalizeWords(address)}
              onChange={(e) => {
                setAddress(e.target.value);
                setErrors((prevErrors) => {
                  return { ...prevErrors, address: "" };
                });
              }}
              variant="outlined"
              fullWidth
              required
              error={!!errors.address}
              helperText={errors.address}
            />
          </Grid>
          {/* ~~~~~~~~~~ Apt, Unit, Suite ~~~~~~~~~~ */}
          <Grid item xs={4}>
            <TextField
              label="Apt, Unit, Suite"
              value={capitalizeWords(unit)}
              onChange={(e) => {
                setUnit(e.target.value);
                setErrors((prevErrors) => {
                  return { ...prevErrors, unit: "" };
                });
              }}
              variant="outlined"
              fullWidth
              error={!!errors.unit}
              helperText={errors.unit}
            />
          </Grid>
          {/* ~~~~~~~~~~ City  ~~~~~~~~~~~~~~~~ */}
          <Grid item xs={12} sm={5}>
            <TextField
              label="City"
              value={capitalizeWords(city)}
              onChange={(e) => {
                setCity(e.target.value);
                setErrors((prevErrors) => {
                  return { ...prevErrors, city: "" };
                });
              }}
              variant="outlined"
              fullWidth
              required
              error={!!errors.city}
              helperText={errors.city}
            />
          </Grid>
          {/* ~~~~~~~~~~ State ~~~~~~~~~~~~~~~~~~~~ */}
          <Grid item xs={12} sm={3}>
            {/* <TextField label="State" variant="outlined" fullWidth required /> */}
            <StateSelector
              onChange={handleStateChange}
              stateSelected={stateSelected}
              isSubmitted={isSubmitted}
              // error={stateError}
              // setError={setStateError}
            />
          </Grid>
          {/* ~~~~~~~~~~ Zip ~~~~~~~~~~~~~~~~~~~~ */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Zip"
              value={zip}
              onChange={(e) => {
                setZip(e.target.value);
                setErrors((prevErrors) => {
                  return { ...prevErrors, zip: "" };
                });
              }}
              variant="outlined"
              fullWidth
              required
              error={!!errors.zip}
              helperText={errors.zip}
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
