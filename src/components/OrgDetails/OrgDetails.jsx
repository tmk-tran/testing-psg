import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// Style
import "./OrgDetails.css";
import { Button, Typography, Card, CardContent } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
// Components
import OrgContactDetails from "../OrgContactDetails/OrgContactDetails";
import OrgGroupInfo from "../OrgGroupInfo/OrgGroupInfo";
import AddGroupPopover from "../AddGroupPopover/AddGroupPopover";
import OrgNotes from "../OrgNotes/OrgNotes";
// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Utils
import { formatDate } from "../Utils/helpers";

export default function orgDetails() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const paramsObject = useParams();
  const dispatch = useDispatch();

  const detailsOrg = useSelector((store) => store.orgDetailsReducer);
  const groups = useSelector((store) => store.orgGroups);
  const notes = useSelector((store) => store.orgNotes);
  console.log(notes);
  // State
  const [noteAdded, setNoteAdded] = useState(false);

  useEffect(() => {
    dispatch({
      type: "FETCH_ORG_DETAILS",
      payload: paramsObject.id,
    });
    dispatch({
      type: "FETCH_ORGANIZATIONS",
      payload: paramsObject.id,
    });
    // Reset noteAdded after fetching data
    setNoteAdded(false);
  }, [paramsObject.id, groups]);

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
    });
  });

  const handleNoteAdded = () => {
    setNoteAdded(true);
  };

  return (
    <div
      className={`OrgDetails-container ${isSmallScreen ? "small-screen" : ""}`}
    >
      <Card className="OrgDetails-card" elevation={3}>
        <CardContent>
          {/* <div className="notes-card-container">
            <Card elevation={3} className="notes-card">
              <CardContent>
                <div className="orgNotes-container">
                  {notes && notes.length > 0 ? (
                    <div>
                      {notes.map((note, i) => (
                        <div key={i}>
                          <p>{formatDate(note.note_date)}</p>
                          <p>{note.note_content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Typography variant="h6">No Notes Available</Typography>
                  )}
                </div>
              </CardContent>
            </Card>
          </div> */}
          <div className="detailsOrg-container">
            <div className="notes-card-container">
              <Card elevation={4} className="notes-card">
                <CardContent>
                  <Typography variant="h6" sx={{ textAlign: "center", mb: 1 }}>Notes</Typography>
                  <div className="orgNotes-container">
                    {notes && notes.length > 0 ? (
                      <div>
                        {notes.map((note, i) => (
                          <div key={i}>
                            {/* <center> */}
                            <Typography variant="body2">{formatDate(note.note_date)}</Typography>
                            {/* </center> */}
                            <li>{note.note_content}</li>
                            <br />
                            <hr style={{ width: "80%" }} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Typography variant="h6">No Notes Available</Typography>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Iterate over the unique organizations in the map */}
            {[...orgMap.values()].map(({ orgDetails, groups }) => (
              <React.Fragment key={orgDetails.organization_id}>
                {/* Display organization details once */}
                <center>
                  <OrgContactDetails info={orgDetails} />
                </center>

                {/* Notes Section */}
                <div>
                  <OrgNotes info={orgDetails} onNoteAdded={handleNoteAdded} />
                </div>

                {/* Toast */}
                <ToastContainer
                  style={{
                    top: "45%",
                    left: "68%",
                    transform: "translate(-50%, -50%)",
                  }}
                />

                {/* Add Group Button */}
                <div className="add-group-btn">
                  <AddGroupPopover info={orgDetails} />
                </div>

                {/* Display associated groups or "No groups assigned" message */}
                <div className="OrgGroupInfo-container">
                  {groups && groups.some((group) => group.group_id !== null) ? (
                    groups.map((groupInfo, i) => (
                      <OrgGroupInfo
                        key={groupInfo.group_id}
                        groupInfo={groupInfo}
                        groupNumber={i + 1}
                      />
                    ))
                  ) : (
                    <Typography variant="h6">No Groups Assigned</Typography>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
