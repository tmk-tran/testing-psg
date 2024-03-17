import React, { useState } from "react";
// ~~~~~~~~~~ Styles ~~~~~~~~~~
import {
  Box,
  Button,
  Card,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import "./OrgContactDetails.css";
// ~~~~~~~~~~ Icons ~~~~~~~~~~
import EditNoteIcon from "@mui/icons-material/EditNote";
// ~~~~~~~~~~ Components ~~~~~~~~~~
import DetailsEdit from "../DetailsEdit/DetailsEdit";
import ContactDetailsCard from "./ContactDetailsCard";
// ~~~~~~~~~~ Utils ~~~~~~~~~~
import { capitalizeWords, formatPhoneNumber } from "../Utils/helpers";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { dispatchHook } from "../../hooks/useDispatch";
import { border } from "../Utils/colors";
import { useSelector } from "react-redux";

export default function ContactDetails({
  info,
  isMerchantTaskPage,
  isOrgAdminPage,
}) {
  const newInfo = info[0]
  console.log(newInfo);
  console.log(isMerchantTaskPage);
  console.log(isOrgAdminPage);
  const dispatch = dispatchHook();
  const auth = useSelector((store) => store.auth);
  const contactPhone = isMerchantTaskPage
    ? formatPhoneNumber(newInfo.contact_phone_number)
    : formatPhoneNumber(newInfo.primary_contact_phone);
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
    console.log("New Contact Info:", editedItem);
    isMerchantTaskPage
      ? dispatch({ type: "EDIT_MERCHANT_DETAILS", payload: {editedItem: editedItem, auth: auth} })
      : dispatch({ type: "EDIT_ORG_DETAILS", payload: {editedItem: editedItem, auth: auth} });
    setIsEditing(false);
  };

  const handleSaveOrgDetails = (editedDetails) => {
    console.log("New Details:", editedDetails);
    isMerchantTaskPage
      ? dispatch({ type: "EDIT_MERCHANT_DETAILS", payload: {editedItem: editedDetails, auth: auth} })
      : dispatch({ type: "EDIT_ORG_DETAILS", payload: {editedItem: editedDetails, auth: auth} });
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
                    <Button onClick={handleEditOrg}>
                      <EditNoteIcon className="edit-note-icon" />
                    </Button>
                  )}
                </div>
                <DetailsEdit
                  isOpen={isEditingOrgDetails}
                  onClose={() => setIsEditingOrgDetails(false)}
                  info={newInfo}
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
                  {capitalizeWords(newInfo.organization_name)}
                </Typography>
              ) : (
                <Typography variant="h5" style={{ fontWeight: "bold" }}>
                  {capitalizeWords(newInfo.merchant_name)}
                </Typography>
              )}
            </div>
            <Typography>{capitalizeWords(newInfo.address)}</Typography>
            <Typography>
              {capitalizeWords(newInfo.city)}, {newInfo.state.toUpperCase()}{" "}
              {newInfo.zip}
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
          info={newInfo}
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
