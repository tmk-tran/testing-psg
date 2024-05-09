import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
// ~~~~~~~~~~ Style ~~~~~~~~~~ //
import "./Details.css";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import ContactDetails from "../ContactDetails/ContactDetails";
import OrgGroupInfo from "../OrgGroupInfo/OrgGroupInfo";
import NotesDisplay from "../NotesDisplay/NotesDisplay";
import OrgDetailsGoalView from "../OrgDetailsGoalView/OrgDetailsGoalView";
import DetailsTaskView from "../DetailsTaskView/DetailsTaskView";
import BackButton from "../Buttons/BackButton";
import SuccessAlert from "../SuccessAlert/SuccessAlert";
import SellersTable from "../OrgSellers/SellersTable";
import OrgAdminInfo from "./OrgAdminInfo";
import LoadingSpinner from "../HomePage/LoadingSpinner";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { dispatchHook } from "../../hooks/useDispatch";
import { useAlert } from "../SuccessAlert/useAlert";
import { oDetails, oNotes, mNotes, User } from "../../hooks/reduxStore";
import { useCaseType } from "../Utils/useCaseType";
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default function Details({
  isMerchantTaskPage,
  isTaskPage,
  isOrgAdminPage,
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const paramsObject = useParams();
  const tableRef = useRef(null);
  const location = useLocation();
  const fragment = window.location.hash.substring(1); // Remove the '#'
  // console.log(fragment);
  // Extract the query paramaeter from the fragment
  const urlSearchParams = new URLSearchParams(
    fragment.substring(fragment.indexOf("?"))
  );
  const isSellerSearched = urlSearchParams.get("isSellerSearched") === "true";
  // console.log(isSellerSearched);

  const isOrgDetailsPage = location.pathname.includes("/orgDetails");

  const { isAlertOpen, handleAlertClose, handleTaskUpdate } = useAlert();
  const { caseType, handleCaseTypeChange } = useCaseType("default");

  // ~~~~~~~~~~ Hooks ~~~~~~~~~~
  const dispatch = dispatchHook();
  const user = User();
  const detailsOrg = oDetails();
  const organizationId =
    detailsOrg.length > 0 ? detailsOrg[0].organization_id : null;
  // Use organizationId, which will be null if detailsOrg is empty
  const notes = isMerchantTaskPage ? mNotes() : oNotes();

  const [groupAdded, setGroupAdded] = useState(false);
  const [locationAdded, setLocationAdded] = useState(false);
  const [noteAdded, setNoteAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch({
      type: "FETCH_ORG_DETAILS",
      payload: paramsObject.id,
    });

    const action = {
      type: isMerchantTaskPage
        ? "FETCH_MERCHANT_DETAILS"
        : "FETCH_ORG_FUNDRAISERS",
      payload: paramsObject.id,
    };
    dispatch(action);

    const actionType = "FETCH_ORG_DETAILS";
    dispatch({
      type: actionType,
      payload: paramsObject.id,
    });

    dispatch({
      type: "FETCH_ORG_GROUPS",
      payload: paramsObject.id,
    });

    dispatch({
      type: "FETCH_ORGANIZATIONS",
      payload: paramsObject.id,
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
    // const detailsOrg = oDetails();
    if (detailsOrg.length > 0) {
      setLoading(false); // Set loading to false when detailsOrg is available
    }
  }, [detailsOrg]);

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

  const handleAddGroup = () => {
    setGroupAdded(true);
  };

  const orgIdsArray = user.org_ids
    ? user.org_ids.split(",").map((id) => parseInt(id.trim()))
    : [];

  return (
    <>
      {loading && (
        <LoadingSpinner
          text="Loading from database..."
          finalText="Oops! ...unexpected error. Please refresh the page, or try again later"
        />
      )}
      <div
        className={`details-container ${isSmallScreen ? "small-screen" : ""}`}
      >
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
            {[...orgMap.values()].map(({ orgDetails, groups }) => (
              <React.Fragment key={orgDetails.organization_id}>
                {!isTaskPage && !isMerchantTaskPage && !isOrgAdminPage && (
                  <NotesDisplay
                    notes={notes}
                    details={orgDetails}
                    caseType={1}
                  />
                )}

                {isTaskPage && !isOrgAdminPage && (
                  <NotesDisplay
                    notes={notes}
                    details={orgDetails}
                    caseType={1}
                  />
                )}

                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~~~~ Instructions for User ~~~~~~~~~~~ */}
                {isOrgAdminPage && <OrgAdminInfo />}

                <center>
                  <ContactDetails
                    info={orgDetails}
                    isOrgAdminPage={isOrgAdminPage}
                  />
                  <br />
                  {/* <OrgDetailsGoalView
                      info={orgDetails}
                      groups={groups}
                      handleAddGroup={handleAddGroup}
                    /> */}
                </center>

                {/* ~~~~~~~~~~ May use later, disabled for now ~~~~~~~~~~ */}
                {/* <div>
                  <OrgNotesModal info={orgDetails} />
                  <AddGroupPopover info={orgDetails} />
                </div> */}
                {/* ~~~~~~~~~~ Task Section ~~~~~~~~~~ */}

                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~~~~  Fundraiser / Group section ~~~~~~~~~~~ */}
                {!isTaskPage && !isMerchantTaskPage && !isOrgAdminPage && (
                  <>
                    <center>
                      <OrgDetailsGoalView
                        info={orgDetails}
                        groups={groups}
                        handleAddGroup={handleAddGroup}
                      />
                    </center>

                    {!isOrgAdminPage ? (
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

                {!isOrgAdminPage && (
                  // Show task-related content on the task page
                  <>
                    <DetailsTaskView caseType="orgTaskView" />
                    <div style={{ height: isTaskPage ? "21vh" : "5vh" }}></div>
                  </>
                )}

                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~~~ Sellers Table ~~~~~~~~~~ */}

                {/* forwardedRef={isSellerSearched ? tableRef : null} */}
                {(isTaskPage || isOrgDetailsPage) &&
                  (!isOrgAdminPage ||
                    (isOrgAdminPage &&
                      orgIdsArray.includes(organizationId) &&
                      user.org_admin)) && (
                    <SellersTable
                      forwardedRef={isSellerSearched ? tableRef : null}
                    />
                  )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
