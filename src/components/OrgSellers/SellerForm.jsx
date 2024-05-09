import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  TextField,
  Grid,
  Divider,
  InputAdornment,
} from "@mui/material";
// ~~~~~~~~~~~~~~ Hooks ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
import { lineDivider } from "../Utils/modalStyles";
import { highlightColor, primaryColor } from "../Utils/colors";
import { capitalizeFirstWord, capitalizeWords } from "../Utils/helpers";
import { useCaseType } from "../Utils/useCaseType";
// ~~~~~~~~~~~~ Components ~~~~~~~~~~~~~~~~~~~~~ //
import ModalButtons from "../Modals/ModalButtons";
import CashUpdateModal from "../SellerPage/CashUpdateModal";
import SellerFormHeader from "./SellerFormHeader";
import { appActiveYear } from "../../hooks/reduxStore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const dividerStyle = {
  backgroundColor: primaryColor.color,
  mb: 2,
};

const generateRefId = (firstName, lastName, teacher) => {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  const teacherInitials = teacher
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("");
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit number

  return `${firstInitial}${lastInitial}${teacherInitials}${randomDigits}`;
};

const sample = generateRefId("susie", "larson", "ms jones");
// console.log(sample);

export default function SellerForm({
  user,
  orgId,
  columns,
  open,
  mode,
  handleClose,
  handleAddSeller,
  handleEditSeller,
  sellerToEdit,
  updateActions,
  setUpdateActions,
}) {
  const initialFormState = columns.reduce((acc, column) => {
    acc[column.id] = [
      "initial_books",
      "additional_books",
      "books_returned",
      "cash",
      "checks",
      "digital",
      "donations",
      "digital_donations",
    ].includes(column.id)
      ? 0
      : "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({
    lastname: false,
    firstname: false,
    teacher: false,
  });
  const { caseType, handleCaseTypeChange } = useCaseType("default");

  // ~~~~~~~~~~ Money update state ~~~~~~~~~~ //
  const [updateMoneyAmount, setUpdateMoneyAmount] = useState(0);
  const [cashEditAmount, setCashEditAmount] = useState(0);
  const [checksEditAmount, setChecksEditAmount] = useState(0);
  const [donationsEditAmount, setDonationsEditAmount] = useState(0);

  const year = appActiveYear() || [];
  const activeYearId = year.length > 0 ? year[0].id : null;

  useEffect(() => {
    if (mode === "edit") {
      setFormData(sellerToEdit);
    } else {
      setFormData(initialFormState);
    }
  }, [mode, sellerToEdit, updateMoneyAmount]);

  const handleChange = (e) => {
    // console.log(e.target.name);
    const { name, value } = e.target;
    const capitalizeValue =
      name === "firstname" ||
      name === "lastname" ||
      name === "level" ||
      name === "teacher"
        ? capitalizeWords(value)
        : name === "notes"
        ? capitalizeFirstWord(value)
        : value;

    // console.log(name, capitalizeValue);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: capitalizeValue,
    }));
    // Clear the error when the user starts typing in the field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };

  const handleFormSubmit = () => {
    let updatedFormData = { ...formData };
    let formIsValid = true;
    let updatedErrors = { ...errors };

    // Check for required fields
    const requiredFields = ["lastname", "firstname", "teacher"];
    requiredFields.forEach((field) => {
      if (!updatedFormData[field]) {
        formIsValid = false;
        updatedErrors[field] = true; // Set the field error to true
      } else {
        updatedErrors[field] = false; // Reset the field error to false if it's filled out
      }
    });

    if (!formIsValid) {
      // Display an error message or handle validation as needed
      console.log("Please fill out all required fields.");
      setErrors(updatedErrors); // Update the errors state with the new error values
      return;
    }

    if (mode === "add") {
      // Check if refId is an empty string or does not exist
      if (!updatedFormData.refId) {
        const refId = generateRefId(
          updatedFormData["firstname"],
          updatedFormData["lastname"],
          updatedFormData["teacher"]
        );
        updatedFormData.refId = refId; // Assign the new refId
      }
      handleAddSeller(updatedFormData);
    } else if (mode === "edit") {
      // Edit logic remains the same
      const editPayload = {
        id: sellerToEdit.id,
        refId: updatedFormData.refId,
        lastname: updatedFormData.lastname,
        firstname: updatedFormData.firstname,
        level: updatedFormData.level,
        teacher: updatedFormData.teacher,
        initial_books: updatedFormData.initial_books,
        additional_books: updatedFormData.additional_books,
        books_returned: updatedFormData.books_returned,
        digital: updatedFormData.digital,
        notes: updatedFormData.notes,
        organization_id: updatedFormData.organization_id,
        is_deleted: updatedFormData.is_deleted,
        books_due: updatedFormData.books_due,
        digital_donations: updatedFormData.digital_donations,
        organization_name: updatedFormData.organization_name,
        address: updatedFormData.address,
        city: updatedFormData.city,
        state: updatedFormData.state,
        zip: updatedFormData.zip,
        physical_book_cash: updatedFormData.physical_book_cash,
        physical_book_digital: updatedFormData.physical_book_digital,
        digital_book_credit: updatedFormData.digital_book_credit,
        seller_earnings: updatedFormData.seller_earnings,
        yearId: activeYearId,
      };
      handleEditSeller(editPayload);
    }

    // console.log(updatedFormData);
    handleFormReset();
  };

  const handleFormReset = () => {
    setFormData(initialFormState);
    setUpdateActions([]);
    setUpdateMoneyAmount(0);
    setCashEditAmount(0);
    setChecksEditAmount(0);
    setDonationsEditAmount(0);
    setErrors(false);
    handleClose();
  };

  const updateSellerInfo = (updateType, amountToUpdate) => {
    // console.log(updateType);
    // console.log(amountToUpdate);
    const sellerId = sellerToEdit.id;
    // console.log(sellerId);
    const refId = sellerToEdit.refId;
    const updateAction = {
      type: `UPDATE_${updateType.toUpperCase()}`,
      payload: {
        id: sellerId,
        refId: refId,
        [updateType.toLowerCase()]: Number(amountToUpdate),
        updateType: updateType.toLowerCase(),
        orgId: orgId,
      },
    };

    // Add the update action to the array
    const updatedActions = [...updateActions, updateAction];
    setUpdateActions(updatedActions);

    // Set the state based on the updateType
    switch (updateType) {
      case "Cash":
        setCashEditAmount(amountToUpdate);
        break;
      case "Checks":
        setChecksEditAmount(amountToUpdate);
        break;
      case "Donations":
        setDonationsEditAmount(amountToUpdate);
        break;
      default:
        break;
    }
  };

  return (
    <Modal
      open={open}
      mode={mode}
      onClose={() => {}}
      aria-labelledby="new-seller-form"
      aria-describedby="form for adding and editing a seller"
    >
      <Box sx={style}>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ Header (add) ~~~~~~~ */}
        {mode === "add" && <SellerFormHeader mode={mode} />}
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ Header (edit) ~~~~~~ */}
        {mode === "edit" && <SellerFormHeader mode={mode} />}
        <Divider sx={lineDivider} />
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            {/* ~~~~~ Top Section ~~~~~ */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    name="lastname"
                    label="Last Name"
                    value={formData["lastname"]}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    error={errors.lastname}
                    helperText={
                      errors["lastname"] ? "Last Name is required" : ""
                    }
                    disabled={mode === "edit" ? true : false}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="firstname"
                    label="First Name"
                    value={formData["firstname"]}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    error={errors.firstname}
                    helperText={
                      errors["firstname"] ? "First Name is required" : ""
                    }
                    disabled={mode === "edit" ? true : false}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="level"
                    label="Level / Grade"
                    value={formData["level"]}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="teacher"
                    label="Lead / Teacher"
                    value={formData["teacher"]}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    required
                    error={errors.teacher}
                    helperText={
                      errors["teacher"] ? "Teacher Name is required" : ""
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* ~~~~~ Second Section ~~~~~ */}
            <Grid item xs={12}>
              <Divider sx={dividerStyle} />
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    name="initial_books"
                    label="Initial Book Count"
                    value={formData["initial_books"]}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    type="number"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    name="additional_books"
                    label="Additional Books"
                    value={formData["additional_books"]}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    type="number"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    name="books_returned"
                    label="Books Returned"
                    value={formData["books_returned"]}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    type="number"
                    disabled={mode === "add" ? true : false}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    name="books_due"
                    label="Books Due"
                    value={formData["books_due"]}
                    onChange={handleChange}
                    sx={highlightColor}
                    fullWidth
                    size="small"
                    type="number"
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* ~~~~~ Third Section ~~~~~ */}
            {mode === "edit" ? (
              <Grid item xs={15}>
                <Divider sx={dividerStyle} />
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <TextField
                      disabled={user.is_admin ? false : true}
                      name="digital"
                      label="Digital Payments"
                      value={formData["digital"]}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      disabled={user.is_admin ? false : true}
                      name="digital_donations"
                      label="Donations (Digital)"
                      value={formData["digital_donations"]}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      name="donations"
                      label="Donations (Cash)"
                      value={
                        Number(formData["donations"]) +
                        Number(donationsEditAmount)
                      }
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      type="number"
                      disabled={mode === "edit" ? true : false}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                    {mode === "edit" && (
                      <CashUpdateModal
                        updateSellerInfo={updateSellerInfo}
                        caseType="Donations"
                        handleCaseTypeChange={handleCaseTypeChange}
                        setUpdateMoneyAmount={setUpdateMoneyAmount}
                      />
                    )}
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      name="checks"
                      label="Checks"
                      value={
                        Number(formData["checks"]) + Number(checksEditAmount)
                      }
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      type="number"
                      disabled={mode === "edit" ? true : false}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                    {mode === "edit" && (
                      <CashUpdateModal
                        updateSellerInfo={updateSellerInfo}
                        caseType="Checks"
                        handleCaseTypeChange={handleCaseTypeChange}
                      />
                    )}
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      name="cash"
                      label="Cash"
                      value={Number(formData["cash"]) + Number(cashEditAmount)}
                      onChange={handleChange}
                      fullWidth
                      size="small"
                      type="number"
                      disabled={mode === "edit" ? true : false}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                    {mode === "edit" && (
                      <CashUpdateModal
                        updateSellerInfo={updateSellerInfo}
                        caseType="Cash"
                        handleCaseTypeChange={handleCaseTypeChange}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            ) : null}
            {/* ~~~~~ Fourth Section ~~~~~ */}
            <Grid item xs={12}>
              <Divider sx={dividerStyle} />
              <TextField
                name="notes"
                label="Notes"
                value={formData["notes"]}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                size="small"
              />
            </Grid>
          </Grid>
        </form>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ Buttons ~~~~~~~~~~ */}
        <ModalButtons
          label={mode === "add" ? "Add" : "Update"}
          variant="contained"
          color="primary"
          onSave={handleFormSubmit}
          onCancel={handleFormReset}
          sx={{ mt: 2 }}
          width="50%"
        />
      </Box>
    </Modal>
  );
}
