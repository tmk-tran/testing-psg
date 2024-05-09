import React, { useState } from "react";
// ~~~~~~~~~~ Styles ~~~~~~~~~~
import { Box, Typography, useMediaQuery } from "@mui/material";
import "./OrgContactDetails.css";
// ~~~~~~~~~~ Icons ~~~~~~~~~~
import EditNoteIcon from "@mui/icons-material/EditNote";
// ~~~~~~~~~~ Components ~~~~~~~~~~
import DetailsEdit from "../DetailsEdit/DetailsEdit";
import ContactDetailsCard from "./ContactDetailsCard";
import EditButton from "../Buttons/EditButton";
// ~~~~~~~~~~ Utils ~~~~~~~~~~
import { capitalizeWords, formatPhoneNumber } from "../Utils/helpers";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { dispatchHook } from "../../hooks/useDispatch";
import { border } from "../Utils/colors";

export default function ContactDetails({
  info,
  isMerchantTaskPage,
  isOrgAdminPage,
}) {
  const dispatch = dispatchHook();
  const contactPhone = isMerchantTaskPage
    ? formatPhoneNumber(info.contact_phone_number)
    : formatPhoneNumber(info.primary_contact_phone);
  const isSmallScreen = useMediaQuery("(max-width:400px)");

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingOrgDetails, setIsEditingOrgDetails] = useState(false);

  const handleEditOrg = () => {
    setIsEditingOrgDetails(true);
  };

  const handleEditContact = () => {
    setIsEditing(true);
  };

  const handleSaveContact = (editedItem) => {
    isMerchantTaskPage
      ? dispatch({ type: "EDIT_MERCHANT_DETAILS", payload: editedItem })
      : dispatch({ type: "EDIT_ORG_DETAILS", payload: editedItem });
    setIsEditing(false);
  };

  const handleSaveOrgDetails = (editedDetails) => {
    const merchantAction = {
      type: "EDIT_MERCHANT_DETAILS",
      payload: editedDetails,
    };
    const orgAction = {
      type: "EDIT_ORG_DETAILS",
      payload: editedDetails,
    };
    isMerchantTaskPage ? dispatch(merchantAction) : dispatch(orgAction);
  };

  return (
    <>
      <div className="org-details">
        <div className="org-address-container">
          <div>
            <center>
              <div className="org-details-header">
                <div className="edit-icon-btn">
                  {!isOrgAdminPage && (
                    <EditButton
                      onClick={handleEditOrg}
                      title={"Edit Account Details"}
                    />
                  )}
                </div>
                <DetailsEdit
                  isOpen={isEditingOrgDetails}
                  onClose={() => setIsEditingOrgDetails(false)}
                  info={info}
                  onSaveChanges={handleSaveOrgDetails}
                  isMerchantTaskPage={isMerchantTaskPage}
                />
              </div>
            </center>
          </div>
          <div className="org-address">
            <div className="org-name-container">
              {!isMerchantTaskPage ? (
                <Typography variant="h5" style={{ fontWeight: "bold" }}>
                  {capitalizeWords(info.organization_name)}
                </Typography>
              ) : (
                <Typography variant="h5" style={{ fontWeight: "bold" }}>
                  {capitalizeWords(info.merchant_name)}
                </Typography>
              )}
            </div>
            <Typography>{capitalizeWords(info.address)}</Typography>
            <Typography>
              {capitalizeWords(info.city)}, {info.state.toUpperCase()}{" "}
              {info.zip}
            </Typography>
          </div>
          <br />
        </div>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~ Contact Details Card ~~~~~~ */}
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        <ContactDetailsCard
          contactPhone={contactPhone}
          handleEditContact={handleEditContact}
          handleSaveContact={handleSaveContact}
          info={info}
          isEditing={isEditing}
          isMerchantTaskPage={isMerchantTaskPage}
          isSmallScreen={isSmallScreen}
          setIsEditing={setIsEditing}
          isOrgAdminPage={isOrgAdminPage}
        />
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        <Box sx={{ flexGrow: 1 }}></Box>
      </div>
    </>
  );
}
