import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
// ~~~~~~~~~~ Style ~~~~~~~~~~ //
import "./Details.css";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import LoadingSpinner from "../HomePage/LoadingSpinner";
import ContactDetails from "../ContactDetails/ContactDetails";
import OrgGroupInfo from "../OrgGroupInfo/OrgGroupInfo";
import NotesDisplay from "../NotesDisplay/NotesDisplay";
import OrgDetailsGoalView from "../OrgDetailsGoalView/OrgDetailsGoalView";
import DetailsTaskView from "../DetailsTaskView/DetailsTaskView";
import CouponReviewCard from "../CouponReviewCard/CouponReviewCard";
import BackButton from "../Buttons/BackButton";
import SuccessAlert from "../SuccessAlert/SuccessAlert";
import LocationsCard from "../LocationsCard/LocationsCard";
import AddNewCouponModal from "../CouponReviewCard/AddNewCouponModal";
import SellersTable from "../OrgSellers/SellersTable";
import OrgAdminInfo from "./OrgAdminInfo";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { dispatchHook } from "../../hooks/useDispatch";
import { useAlert } from "../SuccessAlert/useAlert";
import {
  oDetails,
  oGroups,
  oNotes,
  mDetails,
  mNotes,
  mComments,
  mLocations,
  User,
} from "../../hooks/reduxStore";
import { useCaseType } from "../Utils/useCaseType";
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default function Details({
  isMerchantTaskPage,
  isTaskPage,
  isMerchantDetails,
  isOrgAdminPage,
}) {
  console.log(isMerchantTaskPage);
  console.log(isTaskPage);
  console.log(isMerchantDetails);
  console.log(isOrgAdminPage);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const paramsObject = useParams();
  console.log(paramsObject);
  const location = useLocation();
  const isOrgDetailsPage = location.pathname.includes("/orgDetails");
  console.log(isOrgDetailsPage);

  const { isAlertOpen, handleAlertClose, handleTaskUpdate } = useAlert();
  const { caseType, handleCaseTypeChange } = useCaseType("default");

  // Check if the user is on the task page
  console.log(isTaskPage);

  // ~~~~~~~~~~ Hooks ~~~~~~~~~~
  const dispatch = dispatchHook();
  const user = User();
  console.log(user);
  const detailsOrg = oDetails();
  console.log(detailsOrg);
  // const organizationId =
  //   detailsOrg.length > 0 ? detailsOrg[0].organization_id : null;
  const organizationId =
    detailsOrg.length > 0 ? Number(detailsOrg[0].id) : null;
  // Use organizationId, which will be null if detailsOrg is empty
  console.log(organizationId);
  const groups = oGroups();
  console.log(groups);
  const notes = isMerchantTaskPage ? mNotes() : oNotes();
  console.log(notes);
  const merchantDetails = mDetails();
  console.log(merchantDetails);
  const comments = mComments();
  console.log(comments);
  const locations = mLocations();
  console.log(locations);

  const [isLoading, setIsLoading] = useState(true);
  const [groupAdded, setGroupAdded] = useState(false);
  console.log(groupAdded);
  const [locationAdded, setLocationAdded] = useState(false);
  console.log(locationAdded);
  const auth = useSelector((store) => store.auth);
  const [noteAdded, setNoteAdded] = useState(false);

  useEffect(() => {
    console.log("Dispatching FETCH_ORG_DETAILS");
    dispatch({
      type: "FETCH_ORG_DETAILS",
      payload: { id: paramsObject.id, auth: auth },
    });

    // console.log("Dispatching FETCH_MERCHANT_DETAILS or FETCH_ORG_FUNDRAISERS");
    const action = {
      type: isMerchantTaskPage
        ? "FETCH_MERCHANT_DETAILS"
        : "FETCH_ORG_FUNDRAISERS",
      payload: { id: paramsObject.id, auth: auth },
    };
    console.log(action);
    dispatch(action);

    const actionType = isMerchantTaskPage
      ? "FETCH_MERCHANT_DETAILS"
      : "FETCH_ORG_DETAILS";
    console.log("Dispatching:", actionType);
    dispatch({
      type: actionType,
      payload: { id: paramsObject.id, auth: auth },
    });

    // Fetch locations if MerchantTaskPage is true
    if (isMerchantTaskPage) {
      console.log("Dispatching FETCH_MERCHANT_LOCATION");
      dispatch({
        type: "FETCH_MERCHANT_LOCATION",
        payload: { id: paramsObject.id, auth: auth },
      });
    }

    if (!isMerchantTaskPage) {
      console.log("Dispatching FETCH_ORG_GROUPS");
      dispatch({
        type: "FETCH_ORG_GROUPS",
        payload: { id: paramsObject.id, auth: auth },
      });
    }

    console.log("Dispatching FETCH_ORGANIZATIONS");
    dispatch({
      type: "FETCH_ORGANIZATIONS",
      payload: auth,
    });

    setGroupAdded(false);
    setLocationAdded(false);
    setNoteAdded(false);
  }, [
    paramsObject.id,
    isMerchantTaskPage,
    isTaskPage,
    isOrgAdminPage,
    isOrgDetailsPage,
    groupAdded,
    locationAdded,
    noteAdded,
  ]);

  useEffect(() => {
    if (detailsOrg.length > 0) {
      setIsLoading(false);
    }
  }, [detailsOrg]);

  // Create a map to store organization details and associated groups
  // const orgMap = new Map();

  // Populate the map with unique organizations and associated groups
  // detailsOrg.forEach((info) => {
  //   const orgId = info.organization_id;

  //   if (!orgMap.has(orgId)) {
  //     orgMap.set(orgId, { orgDetails: info, groups: [] });
  //   }

  //   // Add group details to the associated organization
  //   orgMap.get(orgId).groups.push({
  //     group_id: info.group_id,
  //     department: info.department,
  //     sub_department: info.sub_department,
  //     group_nickname: info.group_nickname,
  //     group_photo: info.group_photo,
  //     group_description: info.group_description,
  //     goal: info.sum,
  //   });
  // });

  const handleAddGroup = () => {
    setGroupAdded(true);
  };

  const handleAddLocation = () => {
    setLocationAdded(true);
  };

  // Note addition
  const handleAddNote = () => {
    // Update the noteAdded state to trigger a refresh
    setNoteAdded(true);
  };

  return (
    <div className={`details-container ${isSmallScreen ? "small-screen" : ""}`}>
      <SuccessAlert
        isOpen={isAlertOpen}
        onClose={handleAlertClose}
        caseType={caseType}
      />
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0 }}>
          <BackButton />
        </div>
      </div>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~~~~~~~~ Main Container ~~~~~~~~~~~~~~~~~~~ */}
      <div className="details-card" style={{ marginTop: 40 }}>
        <div className="detailsView-container">
          {isLoading && (
            <LoadingSpinner
              text="Loading from database..."
              finalText="Oops! ...unexpected error. Please refresh the page, or try again later"
            />
          )}
          {!isLoading &&
            detailsOrg.map((orgDetails) => (
              <React.Fragment key={orgDetails?.id}>
                {!isTaskPage && !isMerchantTaskPage && !isOrgAdminPage && (
                  <NotesDisplay notes={notes} details={orgDetails} />
                )}

                {isTaskPage && !isOrgAdminPage && (
                  <NotesDisplay
                    notes={notes}
                    details={orgDetails}
                    caseType={1}
                  />
                )}
                {/* ////////////////////////////////// */}
                {/* Check if it's a merchant task page */}
                {/* ////////////////////////////////// */}
                {isMerchantTaskPage &&
                  !isOrgAdminPage &&
                  // Map over merchantDetails and pass each object to NotesDisplay
                  merchantDetails.map((merchantInfo) => (
                    <React.Fragment key={merchantInfo.id}>
                      <NotesDisplay
                        key={merchantInfo.id}
                        notes={notes}
                        details={merchantInfo}
                        isMerchantTaskPage={isMerchantTaskPage}
                      />
                    </React.Fragment>
                  ))}
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~~~~ Instructions for User ~~~~~~~~~~~ */}
                {isOrgAdminPage && <OrgAdminInfo />}

                <center>
                  {isMerchantTaskPage ? (
                    merchantDetails.map((info) => (
                      <ContactDetails
                        key={info.id}
                        info={info}
                        isMerchantTaskPage={isMerchantTaskPage}
                      />
                    ))
                  ) : (
                    // <OrgContactDetails info={orgDetails} isMerchantTaskPage={isMerchantTaskPage} />
                    <ContactDetails
                      info={detailsOrg}
                      isOrgAdminPage={isOrgAdminPage}
                    />
                  )}
                  <br />
                </center>

                {/* ~~~~~~~~~~ May use later, disabled for now ~~~~~~~~~~ */}
                {/* <div>
                  <OrgNotesModal info={orgDetails} />
                  <AddGroupPopover info={orgDetails} />
                </div> */}
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~~~~  Fundraiser / Group section ~~~~~~~~~~~ */}
                {!isTaskPage && !isMerchantTaskPage && !isOrgAdminPage && (
                  <>
                    <OrgDetailsGoalView
                      info={detailsOrg}
                      groups={groups}
                      handleAddGroup={handleAddGroup}
                    />

                    {!isOrgAdminPage ? (
                      <div className="OrgDetailsCard-container">
                        {groups &&
                        groups.some((group) => group.group_id !== null) ? (
                          groups.map((groupInfo, i) => (
                            <OrgGroupInfo
                              key={groupInfo.id}
                              groupInfo={groupInfo}
                              groupNumber={i + 1}
                            />
                          ))
                        ) : (
                          <div style={{ height: "100px" }}>
                            <Typography variant="h6" sx={{ mt: 2, p: 1 }}>
                              No Groups Assigned
                            </Typography>
                            <hr />
                          </div>
                        )}
                      </div>
                    ) : null}
                  </>
                )}

                {isTaskPage && !isOrgAdminPage && (
                  // Show task-related content on the task page
                  <>
                    <DetailsTaskView caseType="orgTaskView" />
                    <div style={{ height: "40vh" }}></div>
                  </>
                )}

                {isMerchantTaskPage && !isOrgAdminPage && (
                  <>
                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                    {/* ~~~~~~~~~~ TASK SECTION ~~~~~~~~~~ */}
                    <DetailsTaskView caseType={"merchantView"} />
                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                    {/* ~~~~~~~~~~ LOCATION INFO ~~~~~~~~~ */}
                    {locations ? (
                      <LocationsCard
                        locations={locations}
                        handleTaskUpdate={handleTaskUpdate}
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
                        <CouponReviewCard
                          key={i}
                          merchant={merchant}
                          onTaskUpdate={handleTaskUpdate}
                        />
                      ))}
                    </div>
                  </>
                )}
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~~~ Sellers Table ~~~~~~~~~~ */}
                {/* {(isTaskPage || isOrgDetailsPage) && <SellersTable />} */}
                {(isTaskPage || isOrgDetailsPage) &&
                  (!isOrgAdminPage ||
                    (isOrgAdminPage &&
                      user.org_id === organizationId &&
                      user.org_admin)) && <SellersTable />}
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}
