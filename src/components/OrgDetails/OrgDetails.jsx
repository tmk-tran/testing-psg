import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// Style
import "./OrgDetails.css";
import { Button, TextField, Typography, Card, CardContent, Paper } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
// Components
import OrgContactDetails from "../OrgContactDetails/OrgContactDetails";
import OrgGroupInfo from "../OrgGroupInfo/OrgGroupInfo";
import OrgGroupTabs from "../OrgGroupTabs/OrgGroupTabs";

function orgDetails() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const paramsObject = useParams();
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  console.log(edit);

  const detailsOrg = useSelector((store) => store.orgDetailsReducer);

  useEffect(() => {
    dispatch({
      type: "FETCH_ORG_DETAILS",
      payload: paramsObject.id,
    });
  }, []);

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

  return (
    <div
      className={`OrgDetails-container ${isSmallScreen ? "small-screen" : ""}`}
    >
      <Card className="OrgDetails-card" elevation={3}>
        <CardContent>
          <center>
            <div className="org-details-header">
              <Typography variant="h5" style={{ fontWeight: "bold" }}>
                Organization Details
              </Typography>
              <div className="edit-icon-btn">
                <Button onClick={() => setEdit(!edit)}><EditNoteIcon /></Button>
              </div>
            </div>
          </center>
          <div className="detailsOrg-container">
            {/* Iterate over the unique organizations in the map */}
            {[...orgMap.values()].map(({ orgDetails, groups }) => (
              <React.Fragment key={orgDetails.organization_id}>
                {/* Display organization details once */}
                <center>
                  <OrgContactDetails info={orgDetails} />
                </center>

                {/* Display associated groups */}
                {groups.length === 0 && <p>No groups yet</p>}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    // justifyContent: "space-between",
                    justifyContent: "center",
                    gap: "50px",
                    alignItems: "center",
                    marginTop: "25px",
                  }}
                >
                  {groups.map((groupInfo, i) => (
                    <OrgGroupInfo
                      key={groupInfo.group_id}
                      groupInfo={groupInfo}
                      groupNumber={i + 1}
                    />
                  ))}
                </div>
                <br />
                <br />
                <div>
                  <OrgGroupTabs groups={groups} />
                </div>
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default orgDetails;
