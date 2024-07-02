import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { dispatchHook } from "../../hooks/useDispatch";
import { choices } from "../AddAccountModal/contactChoices";
import { mDetails, mNotes, mLocations } from "../../hooks/reduxStore";
import { useCaseType } from "../Utils/useCaseType";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import BackButton from "../Buttons/BackButton";
import NotesDisplay from "../NotesDisplay/NotesDisplay";
import ContactDetails from "../ContactDetails/ContactDetails";
import DetailsTaskView from "../DetailsTaskView/DetailsTaskView";
import LocationsCard from "../LocationsCard/LocationsCard";
import AddNewCouponModal from "../CouponReviewCard/AddNewCouponModal";
import CouponReviewCard from "../CouponReviewCard/CouponReviewCard";
import ContactMethodMenu from "./ContactMethodMenu";
import { showSaveSweetAlert } from "../Utils/sweetAlerts";

export default function MerchantDetails({ isMerchantTaskPage }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = dispatchHook();
  const paramsObject = useParams();
  // ~~~~~~~~~~ State ~~~~~~~~~~ //
  const [locationAdded, setLocationAdded] = useState(false);
  const { caseType, handleCaseTypeChange } = useCaseType("default");

  useEffect(() => {
    const action = {
      type: "FETCH_MERCHANT_DETAILS",
      payload: paramsObject.id,
    };
    dispatch(action);

    const action2 = {
      type: "FETCH_MERCHANT_NOTES",
      payload: paramsObject.id,
    };
    dispatch(action2);

    const action3 = {
      type: "FETCH_MERCHANT_LOCATION",
      payload: paramsObject.id,
    };
    isMerchantTaskPage && dispatch(action3);

    const action4 = {
      type: "FETCH_MERCHANT_TASKS",
      payload: paramsObject.id,
    };
    dispatch(action4);

    setLocationAdded(false);
  }, [paramsObject.id, locationAdded]);

  const merchantDetails = mDetails() || [];
  const notes = mNotes() || [];
  const locations = mLocations() || [];

  const handleAddLocation = () => {
    setLocationAdded(true);
  };

  const handleContactMethod = (newValue) => {
    const dispatchAction = {
      type: "UPDATE_CONTACT_METHOD",
      payload: {
        id: paramsObject.id,
        contact_method: newValue,
      },
    };
    dispatch(dispatchAction);
    showSaveSweetAlert({ label: "Contact Method Updated" });
  };

  return (
    <Box className={`details-container ${isSmallScreen ? "small-screen" : ""}`}>
      <div style={{ position: "relative" }}>
        {/* <div style={{ position: "absolute", top: 0, left: 0 }}> */}
        <div>
          <BackButton />
        </div>
      </div>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~~~~~~~~ Main Container ~~~~~~~~~~~~~~~~~~~ */}
      <div className="details-card" style={{ marginTop: 40 }}>
        <div className="detailsView-container">
          {merchantDetails.map((merchantInfo) => (
            <React.Fragment key={merchantInfo.id}>
              <NotesDisplay
                key={`notes-${merchantInfo.id}`}
                notes={notes}
                details={merchantInfo}
                isMerchantTaskPage={isMerchantTaskPage}
              />
              <center>
                <ContactDetails
                  key={`contact-${merchantInfo.id}`}
                  info={merchantInfo}
                  isMerchantTaskPage={isMerchantTaskPage}
                />
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~~~ Preferred Contact Method ~~~~~~~~~~ */}
                <Typography
                  key={`contact-method-${merchantInfo.id}`}
                  sx={{ mt: 2 }}
                >
                  Preferred contact:{" "}
                  <ContactMethodMenu
                    id={merchantInfo.id}
                    methods={choices}
                    defaultValue={merchantInfo.contact_method}
                    onChange={handleContactMethod}
                  />
                </Typography>
              </center>
            </React.Fragment>
          ))}

          {isMerchantTaskPage && (
            <>
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~ TASK SECTION ~~~~~~~~~~ */}
              <DetailsTaskView caseType={"merchantView"} />
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~ LOCATION INFO ~~~~~~~~~ */}
              {locations ? (
                <LocationsCard
                  locations={locations}
                  handleCaseTypeChange={handleCaseTypeChange}
                  handleAddLocation={handleAddLocation}
                />
              ) : null}
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~ COUPON REVIEW CARDS ~~~~~ */}
              <div className="MerchantDetailsCard-container">
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                  }}
                >
                  {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                  {/* ~~~~~~~~~~ ADD COUPON BUTTON ~~~~~~~~~~ */}
                  <AddNewCouponModal
                    handleCaseTypeChange={handleCaseTypeChange}
                    locations={locations}
                  />
                </div>
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~ COUPON PREVIEW CARDS ~~~~~~~~~ */}
                {merchantDetails.map((merchant, i) => (
                  <CouponReviewCard key={i} merchant={merchant} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Box>
  );
}
