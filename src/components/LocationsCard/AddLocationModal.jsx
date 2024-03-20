import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Modal, TextField, Divider } from "@mui/material";
// ~~~~~~~~~~~ Components ~~~~~~~~~~~~~~~~~~~~
import AddBox from "../AddBoxIcon/AddBoxIcon";
import ModalButtons from "../Modals/ModalButtons";
import PhoneInput from "./PhoneInput";
import StateSelector from "../StateSelector/StateSelector";
import CloseButton from "../Buttons/CloseButton";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~~~~~~~~~~~
import { showSaveSweetAlert } from "../Utils/sweetAlerts";
import { lineDivider, modalHeaderStyle } from "../Utils/modalStyles";
import { dispatchHook } from "../../hooks/useDispatch";

import {
  capitalizeFirstWord,
  capitalizeStateAbbr,
  capitalizeWords,
} from "../Utils/helpers";
import { useSelector } from "react-redux";

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

export default function AddLocationModal({
  handleAddLocation,
  isEditing,
  handleCloseModal,
  editId,
  locationToEdit,
}) {
  console.log(isEditing);
  console.log(editId);
  console.log(locationToEdit);
  const dispatch = dispatchHook();
  const auth = useSelector((store) => store.auth);
  const paramsObject = useParams();
  console.log(paramsObject);

  const [open, setOpen] = useState(false);

  const [locationName, setLocationName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateSelected, setStateSelected] = useState(false);
  const [zip, setZip] = useState("");
  const [merchantId, setMerchantId] = useState(paramsObject.id);
  const [additionalDetails, setAdditionalDetails] = useState("");

  console.log(locationName);
  console.log(phoneNumber);
  console.log(locationAddress);
  console.log(city);
  console.log(stateSelected);
  console.log(zip);
  console.log(merchantId);
  console.log(additionalDetails);
  // ~~~~~~~~~~ Error State ~~~~~~~~~~~~~~~~~~~~ //
  const [nameError, setNameError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [zipError, setZipError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  console.log(isSubmitted);

  useEffect(() => {
    if (locationToEdit) {
      setLocationName(capitalizeWords(locationToEdit.location_name));
      setPhoneNumber(locationToEdit.phone_number);
      setLocationAddress(capitalizeWords(locationToEdit.address));
      setCity(capitalizeWords(locationToEdit.city));
      setState(capitalizeStateAbbr(locationToEdit.state));
      setZip(locationToEdit.zip);
      setAdditionalDetails(
        capitalizeFirstWord(locationToEdit.additional_details)
      );
      handleOpen(); // Open the modal after setting the state
    }
  }, [locationToEdit]); // Trigger the effect when locationToEdit changes

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    handleCloseModal();
  };

  const resetForm = () => {
    setLocationName("");
    setPhoneNumber("");
    setLocationAddress("");
    setCity("");
    setStateSelected(false);
    setZip("");
    setAdditionalDetails("");
    setNameError(false);
    setAddressError(false);
    setCityError(false);
    setStateError(false);
    setZipError(false);
    setPhoneError(false);

    handleClose();
  };

  // NEED TO ADD COORDINATES AND REGION_ID AFTER TALKING TO JOE
  const newLocationPayload = {
    location_name: locationName,
    phone_number: phoneNumber,
    address: locationAddress,
    city: city,
    state: stateSelected,
    zip: zip,
    merchant_id: merchantId,
    additional_details: additionalDetails,
    
  };

  const addLocation = () => {
    if (!locationName) {
      setNameError(true);
      return;
    }
    if (!locationAddress) {
      setAddressError(true);
      return;
    }
    if (!city) {
      setCityError(true);
      return;
    }
    if (!stateSelected) {
      setIsSubmitted(true);
      return;
    }
    if (!zip) {
      setZipError(true);
      return;
    }
    if (!phoneNumber) {
      setPhoneError(true);
      return;
    }
    // Only dispatch if all required fields are filled
    if (
      locationName &&
      locationAddress &&
      city &&
      stateSelected &&
      zip &&
      phoneNumber
    ) {
      dispatch({
        type: "ADD_LOCATION",
        payload: {newLocation: newLocationPayload, auth: auth}
      });
    }

    isSubmitted(true);
    showSaveSweetAlert({ label: "Location Added" });
    handleAddLocation();
    resetForm();
  };

  const editLocation = () => {
    const action = {
      type: "EDIT_LOCATION",
      payload: {editedLocation: { editId, ...newLocationPayload }, auth: auth}
    };
    console.log("Dispatching action:", action);
    dispatch(action);

    showSaveSweetAlert({ label: "Changes Saved" });
    resetForm();
  };

  const handleStateChange = (state, value) => {
    // Handle the state change in the parent component
    console.log(state, value);
    !state
      ? alert("Please select a state.")
      : console.log("READY FOR SUBMIT LOGIC HERE");
    setStateSelected(value);
  };

  return (
    <div>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ ADD BUTTON ~~~~~~~~~~ */}
      <AddBox label="Location" buttonStyle={{ mb: 2 }} onClick={handleOpen} />
      <Modal
        open={open}
        // onClose={handleClose}
        onClose={() => {}}
      >
        <Box sx={style}>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ HEADER ~~~~~~~~~~ */}
          {!isEditing ? (
            <Typography variant="h6" sx={modalHeaderStyle}>
              Add Location
            </Typography>
          ) : (
            <Typography variant="h6" sx={modalHeaderStyle}>
              Edit Location
            </Typography>
          )}
          <Divider sx={lineDivider} />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ NAME ~~~~~~~~~~~~~ */}
          <TextField
            label="Location Name"
            value={capitalizeWords(locationName)}
            onChange={(e) => {
              setLocationName(e.target.value);
              setNameError(false);
            }}
            fullWidth
            sx={{ mb: 2 }}
            required
            error={nameError}
            helperText={nameError ? "Please enter location name" : ""}
          />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ ADDRESS ~~~~~~~~~~ */}
          <TextField
            label="Location Address"
            value={capitalizeWords(locationAddress)}
            onChange={(e) => {
              setLocationAddress(e.target.value);
              setAddressError(false);
            }}
            fullWidth
            sx={{ mb: 2 }}
            required
            error={addressError}
            helperText={addressError ? "Please enter location address" : ""}
          />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ CITY ~~~~~~~~~~~~~ */}
          <TextField
            label="City"
            value={capitalizeWords(city)}
            onChange={(e) => {
              setCity(e.target.value);
              setCityError(false);
            }}
            fullWidth
            sx={{ mb: 2 }}
            required
            error={cityError}
            helperText={cityError ? "Please enter city" : ""}
          />
          <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~ STATE ~~~~~~~~~~~~ */}
            <StateSelector
              onChange={handleStateChange}
              stateSelected={stateSelected}
              isSubmitted={isSubmitted}
              // setError={setStateError}
              // error={stateError}
            />
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~ ZIP ~~~~~~~~~~~~~~ */}
            <TextField
              label="Zip"
              value={zip}
              type="number"
              inputProps={{
                inputMode: "numeric",
              }}
              onChange={(e) => {
                setZip(e.target.value);
                setZipError(false);
              }}
              fullWidth
              sx={{ mb: 2 }}
              required
              error={zipError}
              helperText={zipError ? "Please enter zip code" : ""}
            />
          </div>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~ PHONE NUMBER ~~~~~~~~ */}
          <PhoneInput
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            sx={{ mb: 2 }}
            setPhoneError={setPhoneError}
            error={phoneError}
            helperText={phoneError ? "Please enter phone number" : ""}
          />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~ ADDITIONAL DETAILS ~~~~~~~~ */}
          <TextField
            label="Additional Details..."
            multiline
            rows={3}
            fullWidth
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            sx={{ mb: 2 }}
          />
          <ModalButtons
            label={!isEditing ? "Add" : "Update"}
            onSave={!isEditing ? addLocation : editLocation}
            onCancel={resetForm}
          />
        </Box>
      </Modal>
    </div>
  );
}
