import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Modal,
  TextField,
  Divider,
  Grid,
} from "@mui/material";
// ~~~~~~~~~~~ Components ~~~~~~~~~~~ //
import AddBox from "../AddBoxIcon/AddBoxIcon";
import SelectMenu from "./SelectMenu";
import ModalButtons from "../Modals/ModalButtons";
import AllLocationsButton from "./AllLocationsButton";
import PhoneInput from "../LocationsCard/PhoneInput";
import YearSelect from "../OrgSellers/YearSelect";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~~~~~~~~~~~ //
import { lineDivider, modalHeaderStyle } from "../Utils/modalStyles";
import { dispatchHook } from "../../hooks/useDispatch";
import { capitalizeWords, validateWebsiteFormat } from "../Utils/helpers";
import { showSaveSweetAlert } from "../Utils/sweetAlerts";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  //   width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function AddNewCouponModal({ handleCaseTypeChange, locations }) {
  const dispatch = dispatchHook();
  const paramsObject = useParams();
  console.log(paramsObject);
  console.log(locations);

  const [open, setOpen] = useState(false);
  const [merchantId, setMerchantId] = useState(paramsObject.id);
  // ~~~~~~~~~~ Form State ~~~~~~~~~~~~~~~~~~~ //
  const [selectedLocations, setSelectedLocations] = useState([]);
  console.log(selectedLocations);
  const [seasonIdSelected, setSeasonIdSelected] = useState("");
  const [selectAllLocations, setSelectAllLocations] = useState(false);
  const [phone, setPhone] = useState("");
  const [couponOffer, setCouponOffer] = useState("");
  const [website, setWebsite] = useState("");
  const [couponValue, setCouponValue] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [address, setAddress] = useState("");
  // ~~~~~~~~~~ Errors ~~~~~~~~~~~~~~~~~~~~~~~ //
  const [locationsError, setLocationsError] = useState(false);
  const [websiteError, setWebsiteError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [offerError, setOfferError] = useState(false);
  const [activeYearError, setActiveYearError] = useState(false);

  console.log(phoneError);
  console.log(couponOffer);
  console.log(couponValue);
  console.log(exclusions);
  console.log(address);
  console.log(phone);
  console.log(website);
  console.log(additionalInfo);
  console.log(merchantId);
  console.log(seasonIdSelected);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // NEED TO ADD COORDINATES AND REGION_ID AFTER TALKING TO JOE

  const newCouponPayload = {
    merchant_id: Number(merchantId),
    offer: couponOffer,
    value: Number(couponValue),
    exclusions: exclusions.trim() !== "" ? exclusions : null,
    additional_info: additionalInfo.trim() !== "" ? additionalInfo : null,
    // location_ids: [selectedLocations],
    ...(selectedLocations.length > 0 && { location_ids: [selectedLocations] }),
    book_id: seasonIdSelected,
  };

  const addCoupon = () => {
    // if (!phone) {
    //   setPhoneError(true);
    //   return;
    // }

    // Validate phone number before saving
    // if (phone && !/^\d{10}$/.test(phone)) {
    //   setPhoneError(true);
    //   return;
    // }
    if (!seasonIdSelected) {
      setActiveYearError(true);
      return;
    }

    if (website && !validateWebsiteFormat(website)) {
      setWebsiteError(true);
      return;
    }

    const dispatchAction = {
      type: "ADD_COUPON",
      payload: newCouponPayload,
    };
    console.log(dispatchAction);
    dispatch(dispatchAction);

    handleCaseTypeChange("New Coupon");
    showSaveSweetAlert({ label: "Coupon Added" });
    resetForm();
  };

  const resetForm = () => {
    setSelectedLocations([]);
    setSeasonIdSelected("");
    setPhone("");
    setCouponOffer("");
    setWebsite("");
    setCouponValue("");
    setAdditionalInfo("");
    setExclusions("");
    setSelectAllLocations(false);
    setActiveYearError(false);
    setLocationsError(false);

    handleClose();
  };

  const handleLocationChange = (locationId) => {
    console.log(locationId);
    setSelectedLocations(locationId);
    setLocationsError(false);
  };
  console.log(selectedLocations);

  const handleSelect = (boolean) => {
    console.log(boolean);
    setSelectAllLocations(boolean);
  };

  return (
    <div>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ ADD BUTTON ~~~~~~~~~~ */}
      <AddBox
        title="New Coupon"
        label="Coupon"
        buttonStyle={{ mb: 2 }}
        onClick={handleOpen}
      />
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <Modal
        open={open}
        // onClose={handleClose}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ HEADER ~~~~~~~~~~ */}
          <Typography variant="h6" sx={modalHeaderStyle}>
            Add Coupon
          </Typography>
          <Typography variant="caption" sx={{}}>
            *required
          </Typography>
          <Divider sx={lineDivider} />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~ LOCATION SELECT ~~~~~~~ */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <SelectMenu
                label="Participating Location"
                locations={locations}
                selectAllLocations={selectAllLocations}
                onLocationChange={handleLocationChange}
                error={locationsError}
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~ YEAR SELECT ~~~~~~~~~~ */}
            <Grid item xs={6}>
              <YearSelect
                labelOutside
                sx={{ mb: 2 }}
                setYear={setSeasonIdSelected}
                setActiveYearError={setActiveYearError}
                error={activeYearError}
                helperText={activeYearError ? "Please select a book year" : ""}
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~ SELECT ALL LOCATIONS ~~~~~~~~~ */}
            <Grid item xs={6}>
              <Box
                sx={{
                  border: "1px solid rgba(0, 0, 0, 0.23)", // Match the border style
                  borderRadius: "4px", // Match the border radius
                  padding: "6px 10px", // Match the padding
                  marginBottom: "16px", // Match the margin bottom
                }}
              >
                <AllLocationsButton onSelect={handleSelect} />
              </Box>
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~ OFFER ~~~~~~~~~~~~ */}
              <TextField
                label="Coupon Offer"
                value={capitalizeWords(couponOffer)}
                onChange={(e) => {
                  setCouponOffer(e.target.value);
                }}
                fullWidth
                sx={{ mb: 2 }}
              />
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~ VALUE ~~~~~~~~~~~~ */}
              {/* <TextField
                label="Coupon Value"
                value={couponValue}
                onChange={(e) => setCouponValue(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              /> */}
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~ EXCLUSIONS ~~~~~~~~~ */}
              <TextField
                label="Exclusions"
                value={exclusions}
                onChange={(e) => setExclusions(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={6}>
              {/* <Divider sx={{ mt: 2, mb: 2, ...lineDivider}} /> */}
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~~ PHONE ~~~~~~~~~~~~ */}
              {/* <PhoneInput
                phoneNumber={phone}
                setPhoneNumber={setPhone}
                sx={{ mb: 2 }}
                setPhoneError={setPhoneError}
                error={phoneError}
                helperText={phoneError ? "Invalid phone number" : ""}
              /> */}
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~ VALUE ~~~~~~~~~~~~ */}
              <TextField
                label="Coupon Value"
                value={couponValue}
                onChange={(e) => setCouponValue(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~~ WEBSITE ~~~~~~~~~~~~ */}
              <TextField
                label="Website"
                value={website}
                onChange={(e) => {
                  setWebsite(e.target.value);
                  setWebsiteError(false);
                }}
                inputProps={{
                  required: true,
                }}
                fullWidth
                sx={{ mb: 2 }}
                error={websiteError}
                helperText={
                  websiteError
                    ? "Please enter a valid format (e.g., www.example.com)"
                    : ""
                }
              />
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~ ADDITIONAL INFO ~~~~~~~~ */}
              <TextField
                label="Additional Information..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                fullWidth
                multiline
                sx={{ mb: 2 }}
              />
            </Grid>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~ LOGO UPLOAD~~~~~~~~~ */}
          </Grid>
          {/* <AddFileButton /> */}
          <ModalButtons
            label="Add"
            onSave={addCoupon}
            onCancel={resetForm}
            width="50%"
          />
        </Box>
      </Modal>
    </div>
  );
}
