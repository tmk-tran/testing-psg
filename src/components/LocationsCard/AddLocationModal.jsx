import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Modal, TextField, Divider } from "@mui/material";
// ~~~~~~~~~~~ Components ~~~~~~~~~~~~~~~~~~~~
import AddBox from "../AddBoxIcon/AddBoxIcon";
import ModalButtons from "../Modals/ModalButtons";
import CloseButton from "../Buttons/CloseButton";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~~~~~~~~~~~
import { leftSpace } from "../Details/styleDetails";
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
  onLocationAdd,
  handleCaseTypeChange,
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
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [merchantId, setMerchantId] = useState(paramsObject.id);
  const [additionalDetails, setAdditionalDetails] = useState("");

  console.log(locationName);
  console.log(phoneNumber);
  console.log(locationAddress);
  console.log(city);
  console.log(state);
  console.log(zip);
  console.log(merchantId);
  console.log(additionalDetails);

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
    setState("");
    setZip("");
    setAdditionalDetails("");
    handleClose();
  };

  // NEED TO ADD COORDINATES AND REGION_ID AFTER TALKING TO JOE
  const newLocationPayload = {
    location_name: locationName,
    phone_number: phoneNumber,
    address: locationAddress,
    city: city,
    state: state,
    zip: zip,
    merchant_id: merchantId,
    additional_details: additionalDetails,
    
  };

  const addLocation = () => {
    console.log("Clicked addLocation");
    dispatch({
      type: "ADD_LOCATION",
      payload: {newLocation: newLocationPayload, auth: auth}
    });

    handleCaseTypeChange("New Location");
    onLocationAdd();
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

    handleCaseTypeChange("Edit Location");
    onLocationAdd();
    resetForm();
  };

  return (
    <div>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ ADD BUTTON ~~~~~~~~~~ */}
      <AddBox
        label="Location"
        buttonStyle={{ mb: 2 }}
        onClick={handleOpen}
      />
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
            label="Location Name*"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ ADDRESS ~~~~~~~~~~ */}
          <TextField
            label="Location Address*"
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ CITY ~~~~~~~~~~~~~ */}
          <TextField
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~ STATE ~~~~~~~~~~~~ */}
            <TextField
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              // fullWidth
              sx={{ mb: 2 }}
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
              onChange={(e) => setZip(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
          </div>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~ PHONE NUMBER ~~~~~~~~ */}
          <TextField
            label="Phone Number"
            value={phoneNumber}
            type="number"
            onChange={(e) => setPhoneNumber(Number(e.target.value))}
            fullWidth
            sx={{ mb: 2 }}
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
