import React from "react";
import { useHistory } from "react-router-dom";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import { Card, CardContent, Typography } from "@mui/material";
// ~~~~~~~~~~ Utils ~~~~~~~~~~
import { capitalizeWords, centerStyle, styleImage } from "../Utils/helpers";
import "./OrgGroupInfo.css";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { User } from "../../hooks/reduxStore";

export default function OrgGroupInfoCard({ groupInfo }) {
  const history = useHistory();
  const user = User();

  return (
    <Card
      elevation={3}
      // id="orgDetails-Card"
      className="details-view-card"
      onClick={() => history.push(`/group/${groupInfo.group_id}`)}
    >
      <CardContent>
        <div>
          <Typography
            variant="h6"
            sx={{ textAlign: "center", marginBottom: "10px" }}
          >
            {user.id ? (
              <div>
                <strong>Goal:</strong>{" "}
                {groupInfo.goal !== null ? (
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0, // Set this to 2 if you want cents
                  }).format(groupInfo.goal)
                ) : (
                  <span style={{ fontSize: "22px", fontWeight: 400 }}>
                    None Set
                  </span>
                )}
              </div>
            ) : (
              <Typography sx={{ fontWeight: "bold" }}>
                *Please login to view goals*
              </Typography>
            )}
            <hr />
          </Typography>
        </div>
        {/* ~~~~~ Photo Section ~~~~~ */}
        {/* <div style={{ position: "relative" }}>
          {groupInfo.group_photo ? (
            <center>
              <img
                src={groupInfo.group_photo}
                alt={`Group Photo for ${groupInfo.group_nickname}`}
                style={styleImage}
              />
            </center>
          ) : (
            <div className="no-photo-container">
              <Typography>No Photo</Typography>
            </div>
          )}
        </div> */}
        <br />
        {groupInfo.group_nickname ? (
          <Typography variant="h6" sx={{ ...centerStyle, fontSize: 23 }}>
            Group: "{capitalizeWords(groupInfo.group_nickname)}"
          </Typography>
        ) : (
          <>
            <Typography variant="h6" style={centerStyle}>
              No Group Name
            </Typography>
          </>
        )}

        <div>
          <hr />

          <Typography sx={{ mt: 2 }}>
            <strong>Category:</strong> {capitalizeWords(groupInfo.department)}
          </Typography>
          <Typography variant="caption" sx={{ mt: 2 }}>
            Sub-Category:{" "}
            {groupInfo.sub_department
              ? capitalizeWords(groupInfo.sub_department)
              : "N/A"}
          </Typography>

          {/* Description Section */}
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>
            Description:
          </Typography>
          <div
            className="group-description-container"
            style={{ maxHeight: 75, overflowY: "auto" }}
          >
            <Typography sx={{ overflowWrap: "break-word" }}>
              {groupInfo.group_description
                ? `${groupInfo.group_description
                    .charAt(0)
                    .toUpperCase()}${groupInfo.group_description
                    .slice(1)
                    .toLowerCase()}`
                : "None Entered"}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
