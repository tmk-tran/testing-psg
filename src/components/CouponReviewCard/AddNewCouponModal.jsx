import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Divider,
  Grid,
} from "@mui/material";
// ~~~~~~~~~~~ Components ~~~~~~~~~~~
import AddBox from "../AddBoxIcon/AddBoxIcon";
import CloseButton from "../Buttons/CloseButton";
import SelectMenu from "./SelectMenu";
import AddFileButton from "../AddFileButton/AddFileButton";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~~~~~~~~~~~
import { leftSpace } from "../Details/styleDetails";
import { lineDivider, modalHeaderStyle } from "../Utils/modalStyles";
import { hoverAccept } from "../Utils/colors";
import { dispatchHook } from "../../hooks/useDispatch";
import { validateWebsiteFormat, validatePhoneNumber } from "../Utils/helpers";

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

export default function AddNewCouponModal({
  onCouponAdd,
  handleCaseTypeChange,
  locations,
}) {
  const dispatch = dispatchHook();
  const paramsObject = useParams();
  console.log(paramsObject);
  console.log(locations);

  const [open, setOpen] = useState(false);
  const [couponOffer, setCouponOffer] = useState("");
  const [couponValue, setCouponValue] = useState("");
  const [exclusions, setExclusions] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [merchantId, setMerchantId] = useState(paramsObject.id);
  const [websiteError, setWebsiteError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [offerError, setOfferError] = useState(false);
  console.log(phoneError);
  console.log(couponOffer);
  console.log(couponValue);
  console.log(exclusions);
  console.log(address);
  console.log(city);
  console.log(state);
  console.log(zip);
  console.log(phone);
  console.log(website);
  console.log(additionalInfo);
  console.log(merchantId);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // NEED TO ADD COORDINATES AND REGION_ID AFTER TALKING TO JOE
  const newCouponPayload = {
    coupon_offer: couponOffer,
    coupon_value: couponValue,
    exclusions: exclusions,
    address: address,
    city: city,
    state: state,
    zip: zip,
    phone: phone,
    website: website,
    additional_info: additionalInfo,
    merchant_id: merchantId,
  };

  const addCoupon = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Check if required fields are filled
    if (!couponOffer || !phone || !website) {
      // If any required field is empty, set error state or display error message
      // You can set an error state for each required field and display error messages accordingly
      setOfferError(!offerError);
      setPhoneError(!phone);
      setWebsiteError(!website);
      // You can set error states for other required fields in a similar manner
      return; // Prevent further execution of form submission
    }
    // dispatch({
    //   type: "ADD_COUPON",
    //   payload: newCouponPayload,
    // });

    // Validate phone number before saving
    if (!/^[0-9]*$/.test(phone) && phone.length == 10) {
      setPhoneError(true);
      return;
    }

    // if (phone && !validatePhoneNumber(phone)) {
    //   setPhoneError(true);
    //   return;
    // }

    if (website && !validateWebsiteFormat(website)) {
      setWebsiteError(true);
      return;
    }

    handleCaseTypeChange("New Coupon");
    onCouponAdd();
  };

  const resetForm = () => {
    setCouponOffer("");
    setCouponValue("");
    setExclusions("");
    setAddress("");
    setCity("");
    setState("");
    setZip("");
    setPhone("");
    setWebsite("");

    handleClose();
  };

  return (
    <div>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ ADD BUTTON ~~~~~~~~~~ */}
      <AddBox label="Coupon" buttonStyle={{ mb: 2 }} onClick={handleOpen} />
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <Modal
        open={open}
        // onClose={handleClose}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* //////////////////////////// */}
          {/* ///~~~ CLOSE BUTTON ~~~~~/// */}
          <CloseButton handleClose={resetForm} />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ HEADER ~~~~~~~~~~ */}
          <Typography variant="h6" sx={modalHeaderStyle}>
            Add Coupon
          </Typography>
          <Divider sx={lineDivider} />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~ LOCATION SELECT ~~~~~~~ */}
          <SelectMenu
            label="Participating Location"
            locations={locations}
            fullWidth
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~ OFFER ~~~~~~~~~~~~ */}
              <TextField
                label="Coupon Offer*"
                value={couponOffer}
                onChange={(e) => {
                  setCouponOffer(e.target.value);
                  setOfferError(false);
                }}
                error={offerError}
                helperText={
                  offerError ? "Please enter coupon offer details" : ""
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~ VALUE ~~~~~~~~~~~~ */}
              <TextField
                label="Coupon Value"
                value={couponValue}
                onChange={(e) => setCouponValue(e.target.value)}
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
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~ LOGO UPLOAD~~~~~~~~~ */}
              <AddFileButton />
            </Grid>
            <Grid item xs={6}>
              {/* <Divider sx={{ mt: 2, mb: 2, ...lineDivider}} /> */}

              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~~ PHONE ~~~~~~~~~~~~ */}
              <TextField
                label="Phone Number*"
                type="number"
                inputProps={{
                  minLength: 10,
                  maxLength: 10,
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                  required: true,
                }}
                value={phone}
                onChange={(e) => {
                  setPhone(Number(e.target.value));
                  setPhoneError(false);
                }}
                error={phoneError}
                helperText={phoneError ? "Invalid phone number" : ""}
                fullWidth
                sx={{ mb: 2 }}
              />
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~~ WEBSITE ~~~~~~~~~~~~ */}
              <TextField
                label="Website*"
                value={website}
                onChange={(e) => {
                  setWebsite(e.target.value);
                  setWebsiteError(false);
                }}
                inputProps={{
                  required: true,
                }}
                error={websiteError}
                helperText={
                  websiteError
                    ? "Please enter a valid format (e.g., www.example.com)"
                    : ""
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~ ADDITIONAL INFO ~~~~~~~~ */}
              <TextField
                label="Additional Information..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                fullWidth
                multiline
                rows={3.6}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="secondary"
            sx={hoverAccept}
            fullWidth
            onClick={addCoupon}
          >
            Add
          </Button>
        </Box>
      </Modal>
    </div>
  );
}