import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Modal,
  Divider,
  InputLabel,
  Grid,
  InputAdornment,
} from "@mui/material";
// ~~~~~~~~~~~ Hooks ~~~~~~~~~~~ //
import { dispatchHook } from "../../hooks/useDispatch";
import { lineDivider, modalHeaderStyle } from "../Utils/modalStyles";
import { showSaveSweetAlert } from "../Utils/sweetAlerts";
// ~~~~~~~~~~~ Components ~~~~~~~~~~~ //
import EditButton from "../Buttons/EditButton";
import ModalButtons from "../Modals/ModalButtons";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const textfieldStyle = {
  mb: 2,
};

export default function EditCouponModal({ file }) {
  console.log(file);
  const dispatch = dispatchHook();
  const params = useParams();
  console.log(params);
  const couponId = params.couponId;
  const merchantId = params.merchantId;
  const [open, setOpen] = useState(false);
  const [offer, setOffer] = useState("");
  const [value, setValue] = useState(null);
  const [exclusions, setExclusions] = useState("");
  const [expiration, setExpiration] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (file) {
      setOffer(file.offer || "");
      setValue(file.value || 0);
      setExclusions(file.exclusions || "");
      setExpiration(file.expiration || "");
      setAdditionalInfo(file.additionalInfo || "");
      setPhoneNumber(file.phoneNumber || "");
      setWebsite(file.website || "");
    }
  }, [file]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateCoupon = () => {
    const dispatchAction = {
      type: "UPDATE_COUPON",
      payload: {
        merchantId: merchantId,
        couponId: couponId,
        offer: offer,
        value: value,
        exclusions: exclusions,
        expiration: expiration,
        additional_info: additionalInfo,
      },
    };
    console.log(dispatchAction);
    dispatch(dispatchAction);
    resetForm();
  };

  const resetForm = () => {
    setOffer("");
    setValue(0);
    setExclusions("");
    setExpiration("");
    setAdditionalInfo("");
    showSaveSweetAlert({ label: "Coupon Updated" });

    handleClose();
  };

  return (
    <div>
      <EditButton onClick={handleOpen} title={"Edit Coupon Details"} />
      <Modal
        open={open}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" sx={modalHeaderStyle}>
            Edit Coupon
          </Typography>
          <Divider sx={lineDivider} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Offer"
                fullWidth
                value={offer}
                onChange={(e) => {
                  setOffer(e.target.value);
                }}
                sx={textfieldStyle}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Exclusions"
                fullWidth
                value={exclusions}
                onChange={(e) => {
                  setExclusions(e.target.value);
                }}
                sx={textfieldStyle}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Additional details"
                fullWidth
                multiline
                rows={2}
                value={additionalInfo}
                onChange={(e) => {
                  setAdditionalInfo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Value</InputLabel>
              <TextField
                type="number"
                fullWidth
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                sx={textfieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Expiration</InputLabel>
              <TextField
                type="date"
                fullWidth
                value={expiration}
                onChange={(e) => {
                  setExpiration(e.target.value);
                }}
                sx={textfieldStyle}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                label="Phone"
                fullWidth
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Website"
                fullWidth
                value={website}
                onChange={(e) => {
                  setWebsite(e.target.value);
                }}
              />
            </Grid>
          </Grid>
          <br />
          <ModalButtons
            label="Save"
            onSave={updateCoupon}
            onCancel={handleClose}
            width="50%"
          />
        </Box>
      </Modal>
    </div>
  );
}
