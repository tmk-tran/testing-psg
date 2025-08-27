import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Modal,
  TextField,
  Divider,
  Grid,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
// ~~~~~~~~~~~ Components ~~~~~~~~~~~ //
import AddBox from "../AddBoxIcon/AddBoxIcon";
import LocationSelect from "./LocationSelect";
import ModalButtons from "../Modals/ModalButtons";
import YearSelect from "../OrgSellers/YearSelect";
// ~~~~~~~~~~ Hooks/Utils ~~~~~~~~~~~~~~~~~~~~ //
import { dispatchHook } from "../../hooks/useDispatch";
import { lineDivider, modalHeaderStyle } from "../Utils/modalStyles";
import { capitalizeWords, validateWebsiteFormat } from "../Utils/helpers";
import { showSaveSweetAlert } from "../Utils/sweetAlerts";

// SAME ISSUE AS IN EditCouponModal:
// Need to figure out a way to deselect radio button when a value is selected in dropdown
// the dropdown is already cleared when the radio button is selected

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

  const [open, setOpen] = useState(false);
  const [merchantId, setMerchantId] = useState(paramsObject.id);
  // ~~~~~~~~~~ Form State ~~~~~~~~~~~~~~~~~~~ //
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [seasonIdSelected, setSeasonIdSelected] = useState("");
  const [selectAllLocations, setSelectAllLocations] = useState(false);
  const [selectedValue, setSelectedValue] = useState(""); // Track selected radio button
  const [couponOffer, setCouponOffer] = useState("");
  const [website, setWebsite] = useState("");
  const [couponValue, setCouponValue] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [isDropdownSelected, setIsDropdownSelected] = useState(false);
  // ~~~~~~~~~~ Errors ~~~~~~~~~~~~~~~~~~~~~~~ //
  const [locationsError, setLocationsError] = useState(false);
  const [websiteError, setWebsiteError] = useState(false);
  const [activeYearError, setActiveYearError] = useState(false);

  useEffect(() => {
    if (isDropdownSelected) {
      setSelectedValue(""); // Deselect radio button when dropdown is selected
      setSelectAllLocations(false);
    }
  }, [isDropdownSelected]);

  useEffect(() => {
    if (selectAllLocations) {
      setIsDropdownSelected(false);
    }
  }, [selectAllLocations]);

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
    dispatch(dispatchAction);

    handleCaseTypeChange("New Coupon");
    showSaveSweetAlert({ label: "Coupon Added" });
    resetForm();
  };

  const resetForm = () => {
    setSelectedLocations([]);
    setSeasonIdSelected("");
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
    setSelectedLocations(locationId);
    setLocationsError(false);
  };

  const handleSelect = (event) => {
    setSelectAllLocations(true);
    setSelectedValue(event.target.value);
  };
  const handleDeselect = () => {
    setSelectAllLocations(false);
    setSelectedValue("");
  };

  // For the dropdown selection
  const handleDropdownSelectChange = (state) => {
    setIsDropdownSelected(state);
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
              <LocationSelect
                label="Participating Location"
                locations={locations}
                selectAllLocations={selectAllLocations}
                onLocationChange={handleLocationChange}
                error={locationsError}
                onDropdownSelectChange={handleDropdownSelectChange}
                onChange={handleDeselect}
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
                helpertext={activeYearError ? "Please select a book year" : ""}
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
                {/* <LocationsRadioGroup onSelect={handleSelect} /> */}
                <FormControl component="fieldset">
                  <RadioGroup
                    value={selectedValue}
                    onChange={handleSelect}
                    aria-label="validity"
                    name="validity-group"
                  >
                    <FormControlLabel
                      value="validAtAllLocations"
                      control={<Radio />}
                      label={<Typography>Valid at All Locations</Typography>}
                    />
                  </RadioGroup>
                </FormControl>
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
