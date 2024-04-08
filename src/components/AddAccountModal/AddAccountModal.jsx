import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import Swal from "sweetalert2";
import InputAdornment from "@mui/material/InputAdornment";
import AddFileButton from "../AddFileButton/AddFileButton";
// ~~~~~~~~~~~ Hooks ~~~~~~~~~~~
import { choices } from "./contactChoices";
import { lineDivider, modalHeaderStyle } from "../Utils/modalStyles";
import { hoverAccept, primaryColor } from "../Utils/colors";
// ~~~~~~~~~~~ Components ~~~~~~~~~~~
import StateFieldInput from "./StateFieldInput";
import WebsiteInput from "./WebsiteInput";
import RadioButtons from "./RadioButtons";
import { capitalizeFirstWord, capitalizeWords } from "../Utils/helpers";
import ModalButtons from "../Modals/ModalButtons";
import PhoneInput from "../LocationsCard/PhoneInput";
import StateSelector from "../StateSelector/StateSelector";
import { showSaveSweetAlert } from "../Utils/sweetAlerts";

export default function AddAccountModal({
  open,
  handleModalClose,
  isMerchantList,
}) {
  console.log(isMerchantList);
  const dispatch = useDispatch();

  // ~~~~~ Set state for the add organization form ~~~~~ //
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [merchantName, setMerchantName] = useState("");
  console.log(merchantName);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState(false);
  const [zip, setZip] = useState("");
  const [merchantWebsite, setMerchantWebsite] = useState("");
  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [logoFile, setLogoFile] = useState("");
  console.log(logoFile);
  const [orgEarnings, setOrgEarnings] = useState(10);
  const [selectedChoice, setSelectedChoice] = useState("");
  console.log(selectedChoice);
  // ~~~~~~~~~ Errors ~~~~~~~~~~~ //
  const [organizationNameError, setOrganizationNameError] = useState(false);
  const [organizationTypeError, setOrganizationTypeError] = useState(false);
  const [merchantNameError, setMerchantNameError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [zipError, setZipError] = useState(false);
  const [contactFirstNameError, setContactFirstNameError] = useState(false);
  const [contactLastNameError, setContactLastNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleLogoSelection = (selectedFile) => {
    setLogoFile(selectedFile);
  };
  console.log(contactPhone);
  // Save function to dispatch data for new organization
  const handleSave = () => {
    console.log("clicked");
    if (!isMerchantList) {
      if (!organizationName) {
        setOrganizationNameError(true);
        return;
      }
    }
    if (!isMerchantList) {
      if (!organizationType) {
        setOrganizationTypeError(true);
        return;
      }
    }
    if (isMerchantList) {
      if (!merchantName) {
        setMerchantNameError(true);
        return;
      }
    }
    if (!address) {
      setAddressError(true);
      return;
    }
    if (!city) {
      setCityError(true);
      return;
    }
    if (!state) {
      setIsSubmitted(true);
      return;
    }
    if (!zip) {
      setZipError(true);
      return;
    }
    if (!contactFirstName) {
      setContactFirstNameError(true);
      return;
    }
    if (!contactLastName) {
      setContactLastNameError(true);
      return;
    }
    if (!contactPhone) {
      setPhoneError(true);
      return;
    }

    const action1 = {
      type: "ADD_ORGANIZATION",
      payload: {
        organization_name: organizationName,
        type: organizationType,
        address,
        city,
        state,
        zip,
        primary_contact_first_name: contactFirstName,
        primary_contact_last_name: contactLastName,
        primary_contact_phone: contactPhone,
        primary_contact_email: contactEmail,
        organization_logo: logoFile,
        organization_earnings: orgEarnings,
      },
    };
    !isMerchantList && console.log(action1);
    !isMerchantList && dispatch(action1);

    const action2 = {
      type: "ADD_MERCHANT",
      payload: {
        merchant_name: merchantName,
        address,
        city,
        state,
        zip,
        primary_contact_first_name: contactFirstName,
        primary_contact_last_name: contactLastName,
        contact_phone_number: contactPhone,
        contact_email: contactEmail,
        merchant_logo: logoFile,
        website: merchantWebsite,
        contact_method: selectedChoice,
      },
    };
    isMerchantList && console.log(action2);
    isMerchantList && dispatch(action2);

    // clear input fields
    clearFields();
    // close modal
    handleModalClose();
    // Sweet alert
    !isMerchantList &&
      showSaveSweetAlert({ label: "Organization successfully added" });
    isMerchantList &&
      showSaveSweetAlert({ label: "Merchant successfully added" });
  };

  const clearFields = () => {
    setOrganizationName("");
    setMerchantName("");
    setOrganizationType("");
    setAddress("");
    setCity("");
    setState(false);
    setZip("");
    setContactFirstName("");
    setContactLastName("");
    setContactPhone("");
    setContactEmail("");
    setLogoFile("");
    setOrgEarnings(10);
    setOrganizationNameError(false);
    setOrganizationTypeError(false);
    setMerchantNameError(false);
    setAddressError(false);
    setCityError(false);
    setStateError(false);
    setZipError(false);
    setPhoneError(false);
  };

  // for cancel button
  const cancelAdd = () => {
    clearFields();
    handleModalClose();
  };

  // modal style
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

  const dividerMarginTop = {
    ...lineDivider,
    mt: 3,
    ml: 2,
    width: "98%",
  };

  const stateInput = (value) => {
    console.log(value.abbreviation);
    setState(value.abbreviation);
  };

  const websiteInput = (value) => {
    setMerchantWebsite(value);
  };

  const handleSelectionChange = (choice) => {
    setSelectedChoice(choice);
  };

  return (
    <div>
      <Modal
        open={open}
        // onClose={handleModalClose}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~~~ HEADER ~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          <Typography variant="h6" sx={modalHeaderStyle}>
            {!isMerchantList ? "Add New Organization" : "Add New Merchant"}
          </Typography>
          {/* ~~~~~~~~~~ END HEADER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          <Divider sx={lineDivider} />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          <Grid container spacing={1} sx={{ mb: 3 }}>
            <Grid item xs={9}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Name / Location
              </Typography>
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ ORG FEE ~~~~~~~~~~~~~~~ */}
            {!isMerchantList ? (
              <Grid item xs={3}>
                <TextField
                  label="Fee"
                  fullWidth
                  value={orgEarnings}
                  onChange={(e) => setOrgEarnings(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ) : null}
            <Grid item xs={!isMerchantList ? 6 : 12}>
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~~~ NAME ~~~~~~~~~~~~~~~~~~ */}
              <TextField
                required
                label={!isMerchantList ? "Organization Name" : "Merchant Name"}
                fullWidth
                value={capitalizeWords(
                  !isMerchantList ? organizationName : merchantName
                )}
                onChange={(e) => {
                  !isMerchantList
                    ? (setOrganizationName(capitalizeFirstWord(e.target.value)),
                      setOrganizationNameError(false))
                    : (setMerchantName(capitalizeFirstWord(e.target.value)),
                      setMerchantNameError(false));
                }}
                error={
                  !isMerchantList ? organizationNameError : merchantNameError
                }
                helperText={
                  !isMerchantList
                    ? organizationNameError
                      ? "Please enter an organization name"
                      : ""
                    : merchantNameError
                    ? "Please enter a merchant name"
                    : ""
                }
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ TYPE ~~~~~~~~~~~~~~~~~~ */}
            {!isMerchantList ? (
              <Grid item xs={6}>
                <TextField
                  required
                  label="Organization Type"
                  fullWidth
                  value={capitalizeWords(organizationType)}
                  onChange={(e) => {
                    setOrganizationType(e.target.value);
                    setOrganizationTypeError(false);
                  }}
                  error={organizationTypeError}
                  helperText={
                    organizationTypeError
                      ? "Please select an organization type"
                      : ""
                  }
                />
              </Grid>
            ) : null}
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ ADDRESS ~~~~~~~~~~~~~~~ */}
            <Grid item xs={12}>
              <TextField
                required
                label="Address"
                fullWidth
                value={capitalizeWords(address)}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setAddressError(false);
                }}
                error={addressError}
                helperText={addressError ? "Please enter an address" : ""}
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ CITY ~~~~~~~~~~~~~~~~~~ */}
            <Grid item xs={4}>
              <TextField
                required
                label="City"
                fullWidth
                value={capitalizeWords(city)}
                onChange={(e) => {
                  setCity(e.target.value);
                  setCityError(false);
                }}
                error={cityError}
                helperText={cityError ? "Please enter a city" : ""}
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ STATE ~~~~~~~~~~~~~~~~~ */}
            <Grid item xs={4}>
              {/* <StateFieldInput label={"State*"} stateInput={stateInput} /> */}
              <StateSelector
                onChange={stateInput}
                stateSelected={state}
                isSubmitted={isSubmitted}
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ ZIP ~~~~~~~~~~~~~~~~~~ */}
            <Grid item xs={4}>
              <TextField
                required
                label="Zip Code"
                fullWidth
                value={zip}
                type="number"
                onChange={(e) => {
                  setZip(Number(e.target.value));
                  setZipError(false);
                }}
                error={zipError}
                helperText={zipError ? "Please enter a zip code" : ""}
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ WEBSITE (needs router adjustment) ~~~~~~~~~~~~~~~ */}
            {isMerchantList ? (
              <Grid item xs={12}>
                <WebsiteInput
                  label="Website (optional)"
                  onWebsiteChange={websiteInput}
                />
              </Grid>
            ) : null}
            {/* //////////////////////////////////// */}
            {/* ////////// CONTACT INFO //////////// */}
            {/* //////////////////////////////////// */}
            <Divider sx={dividerMarginTop} />
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Primary Contact
              </Typography>
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ FIRST NAME~~~~~~~~~~~~~ */}
            <Grid item xs={6}>
              <TextField
                label="Contact First Name*"
                fullWidth
                value={capitalizeWords(contactFirstName)}
                onChange={(e) => {
                  setContactFirstName(e.target.value);
                  setContactFirstNameError(false);
                }}
                error={contactFirstNameError}
                helperText={
                  contactFirstNameError ? "Please enter a first name" : ""
                }
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ LAST NAME ~~~~~~~~~~~~~ */}
            <Grid item xs={6}>
              <TextField
                required
                label="Contact Last Name"
                fullWidth
                value={capitalizeWords(contactLastName)}
                onChange={(e) => {
                  setContactLastName(e.target.value);
                  setContactLastNameError(false);
                }}
                error={contactLastNameError}
                helperText={
                  contactLastNameError ? "Please enter a last name" : ""
                }
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ PHONE ~~~~~~~~~~~~~~~~~ */}
            <Grid item xs={6}>
              <PhoneInput
                phoneNumber={contactPhone}
                setPhoneNumber={setContactPhone}
                sx={{ mb: 2 }}
                setPhoneError={setPhoneError}
                error={phoneError}
                helperText={phoneError ? "Please enter phone number" : ""}
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ EMAIL ~~~~~~~~~~~~~~~~~ */}
            <Grid item xs={6}>
              <TextField
                label="Email (optional)"
                fullWidth
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~ PREFERED CONTACT METHOD ~~~~~~ */}
            {isMerchantList ? (
              <>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                    Preferred Method:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <RadioButtons
                    choices={choices}
                    onSelectionChange={handleSelectionChange}
                  />
                </Grid>
              </>
            ) : null}
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~~~ LOGO ~~~~~~~~~~~~~~~~~~ */}
            <Grid item xs={12}>
              <AddFileButton onFileSelect={handleLogoSelection} />
            </Grid>
          </Grid>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ ADD BUTTON ~~~~~~~~~~~~~~ */}
          <ModalButtons
            label="Add"
            onSave={handleSave}
            onCancel={cancelAdd}
            width="50%"
          />
        </Box>
      </Modal>
    </div>
  );
}
