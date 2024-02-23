import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import "./Details.css";
import { Button, Typography, Card, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddBoxIcon from "@mui/icons-material/AddBox";
// ~~~~~~~~~~ Components ~~~~~~~~~~
import ContactDetails from "../ContactDetails/ContactDetails";
import OrgGroupInfo from "../OrgGroupInfo/OrgGroupInfo";
import NotesDisplay from "../NotesDisplay/NotesDisplay";
import OrgDetailsGoalView from "../OrgDetailsGoalView/OrgDetailsGoalView";
import DetailsTaskView from "../DetailsTaskView/DetailsTaskView";
import CouponReviewCard from "../CouponReviewCard/CouponReviewCard";
import MerchantContactDetails from "../ContactDetails/MerchantContactDetails";
import BackButton from "../Buttons/BackButton";
import SuccessAlert from "../SuccessAlert/SuccessAlert";
import LocationsCard from "../LocationsCard/LocationsCard";
import AddNewCouponModal from "../CouponReviewCard/AddNewCouponModal";
import SellersTable from "../OrgSellers/SellersTable";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
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
} from "../../hooks/reduxStore";
import { border } from "../Utils/colors";
import { leftSpace } from "./styleDetails";
import { useCaseType } from "../Utils/useCaseType";
import { buttonIconSpacing } from "../Utils/helpers";
import AddBox from "../AddBoxIcon/AddBoxIcon";
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default function Details({
  isMerchantTaskPage,
  isTaskPage,
  isMerchantDetails,
}) {
  console.log(isMerchantTaskPage);
  console.log(isMerchantDetails);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const paramsObject = useParams();
  console.log(paramsObject);

  const { isAlertOpen, handleAlertClose, handleTaskUpdate } = useAlert();
  const { caseType, handleCaseTypeChange } = useCaseType("default");

  // Check if the user is on the task page
  // const isTaskPage = location.pathname.includes("/orgtaskdetails");
  // const isMerchantTaskPage = location.pathname.includes("/merchantTaskDetails");
  console.log(isTaskPage);

  // ~~~~~~~~~~ Hooks ~~~~~~~~~~
  const dispatch = dispatchHook();
  const detailsOrg = oDetails();
  const groups = oGroups();
  console.log(groups);
  // const notes = !isMerchantTaskPage ? oNotes() : mNotes();
  const notes = isMerchantTaskPage ? mNotes() : oNotes();
  console.log(notes);
  const merchantDetails = mDetails();
  console.log(merchantDetails);
  const comments = mComments();
  console.log(comments);
  const [alertCaseType, setAlertCaseType] = useState("NewTask");
  console.log(alertCaseType);
  const locations = mLocations();
  console.log(locations);
  const [groupAdded, setGroupAdded] = useState(false);
  console.log(groupAdded);
  const [locationAdded, setLocationAdded] = useState(false);
  console.log(locationAdded);

  // useEffect(() => {
  //   dispatch({
  //     type: "FETCH_ORG_DETAILS",
  //     payload: paramsObject.id,
  //   });

  //   dispatch({
  //     type: isMerchantTaskPage
  //       ? "FETCH_MERCHANT_DETAILS"
  //       : "FETCH_ORG_FUNDRAISERS",
  //     payload: paramsObject.id,
  //   });
  //   // Fetch locations if MerchantTaskPage is true
  //   if (isMerchantTaskPage) {
  //     dispatch({
  //       type: "FETCH_MERCHANT_LOCATION",
  //       payload: paramsObject.id,
  //     });
  //   }

  //   if (!isMerchantTaskPage) {
  //     dispatch({
  //       type: "FETCH_ORG_GROUPS",
  //       payload: paramsObject.id,
  //     });
  //   };

  //   dispatch({
  //     type: "FETCH_ORGANIZATIONS",
  //     payload: paramsObject.id,
  //   });
  //   setGroupAdded(false);
  // }, [paramsObject.id, isMerchantTaskPage, groupAdded]);

  useEffect(() => {
    console.log("Dispatching FETCH_ORG_DETAILS");
    dispatch({
      type: "FETCH_ORG_DETAILS",
      payload: paramsObject.id,
    });

    console.log("Dispatching FETCH_MERCHANT_DETAILS or FETCH_ORG_FUNDRAISERS");
    dispatch({
      type: isMerchantTaskPage
        ? "FETCH_MERCHANT_DETAILS"
        : "FETCH_ORG_FUNDRAISERS",
      payload: paramsObject.id,
    });

    const actionType = isMerchantTaskPage
      ? "FETCH_MERCHANT_DETAILS"
      : "FETCH_ORG_DETAILS";
    console.log("Dispatching:", actionType);
    dispatch({
      type: actionType,
      payload: paramsObject.id,
    });

    // Fetch locations if MerchantTaskPage is true
    if (isMerchantTaskPage) {
      console.log("Dispatching FETCH_MERCHANT_LOCATION");
      dispatch({
        type: "FETCH_MERCHANT_LOCATION",
        payload: paramsObject.id,
      });
    }

    if (!isMerchantTaskPage) {
      console.log("Dispatching FETCH_ORG_GROUPS");
      dispatch({
        type: "FETCH_ORG_GROUPS",
        payload: paramsObject.id,
      });
    }

    console.log("Dispatching FETCH_ORGANIZATIONS");
    dispatch({
      type: "FETCH_ORGANIZATIONS",
      payload: paramsObject.id,
    });

    setGroupAdded(false);
    setLocationAdded(false);
  }, [paramsObject.id, isMerchantTaskPage, groupAdded, locationAdded]);

  // Create a map to store organization details and associated groups
  const orgMap = new Map();

  // Populate the map with unique organizations and associated groups
  detailsOrg.forEach((info) => {
    const orgId = info.organization_id;

    if (!orgMap.has(orgId)) {
      orgMap.set(orgId, { orgDetails: info, groups: [] });
    }

    // Add group details to the associated organization
    orgMap.get(orgId).groups.push({
      group_id: info.group_id,
      department: info.department,
      sub_department: info.sub_department,
      group_nickname: info.group_nickname,
      group_photo: info.group_photo,
      group_description: info.group_description,
      goal: info.sum,
    });
  });

  // const handleCaseTypeChange = (newCaseType) => {
  //   setAlertCaseType(newCaseType);
  // };

  const handleAddGroup = () => {
    setGroupAdded(true);
  };

  const handleAddLocation = () => {
    setLocationAdded(true);
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
      {/* <Card className="details-card" elevation={3}>
        <CardContent> */}
      <div className="details-card" style={{ marginTop: 40 }}>
        <div className="detailsView-container">
          {[...orgMap.values()].map(({ orgDetails, groups }) => (
            <React.Fragment key={orgDetails.organization_id}>
              {!isTaskPage && !isMerchantTaskPage && (
                <NotesDisplay notes={notes} orgDetails={orgDetails} />
              )}

              {isTaskPage && (
                <NotesDisplay
                  notes={notes}
                  orgDetails={orgDetails}
                  caseType={1}
                />
              )}
              {/* ////////////////////////////////// */}
              {/* Check if it's a merchant task page */}
              {/* ////////////////////////////////// */}
              {isMerchantTaskPage &&
                // Map over merchantDetails and pass each object to NotesDisplay
                merchantDetails.map((merchantInfo) => (
                  <NotesDisplay
                    key={merchantInfo.id}
                    notes={notes}
                    orgDetails={merchantInfo}
                    isMerchantTaskPage={isMerchantTaskPage}
                  />
                ))}

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
                  <ContactDetails info={orgDetails} />
                )}
                <br />
              </center>

              {/* ~~~~~~~~~~ May use later, disabled for now ~~~~~~~~~~ */}
              {/* <div>
                  <OrgNotesModal info={orgDetails} />
                  <AddGroupPopover info={orgDetails} />
                </div> */}
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

              {!isTaskPage && !isMerchantTaskPage && (
                // Default content when not on the task page
                <>
                  <OrgDetailsGoalView
                    info={orgDetails}
                    groups={groups}
                    handleAddGroup={handleAddGroup}
                  />

                  <div className="OrgDetailsCard-container">
                    {groups &&
                    groups.some((group) => group.group_id !== null) ? (
                      groups.map((groupInfo, i) => (
                        <OrgGroupInfo
                          key={groupInfo.group_id}
                          groupInfo={groupInfo}
                          groupNumber={i + 1}
                        />
                      ))
                    ) : (
                      <div style={{ height: "200px" }}>
                        <Typography variant="h6">No Groups Assigned</Typography>
                      </div>
                    )}
                  </div>
                </>
              )}

              {isTaskPage && (
                // Show task-related content on the task page
                <>
                  <DetailsTaskView caseType="orgTaskView" />
                  <div style={{ height: "40vh" }}></div>
                </>
              )}

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
                      handleTaskUpdate={handleTaskUpdate}
                      handleCaseTypeChange={handleCaseTypeChange}
                      handleAddLocation={handleAddLocation}
                    />
                  ) : null}
                  {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                  {/* ~~~~~ COUPON REVIEW CARDS ~~~~~ */}
                  <div className="MerchantDetailsCard-container" style={border}>
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        ...leftSpace,
                      }}
                    >
                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~ ADD COUPON BUTTON ~~~~~~~~~~ */}
                      <AddNewCouponModal
                        onCouponAdd={handleTaskUpdate}
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
              <SellersTable />
            </React.Fragment>
          ))}
        </div>
        {/* </CardContent>
      </Card> */}
      </div>
    </div>
  );
}
