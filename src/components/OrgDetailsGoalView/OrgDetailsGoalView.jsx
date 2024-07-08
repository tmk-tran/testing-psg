import React from "react";
// ~~~~~~~~~~ Style ~~~~~~~~~~ //
import { Typography, Card, CardContent } from "@mui/material";
import "./OrgDetailsGoalView.css";
// ~~~~~~~~~~ Component ~~~~~~~~~~ //
import AddGroupPopover from "../AddGroupPopover/AddGroupPopover";
import TableGroupDetails from "../TableGroupDetails/TableGroupDetails";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { oFundraisers } from "../../hooks/reduxStore";

export default function OrgDetailsGoalView({ info, groups, handleAddGroup }) {
  const fundraiserInfo = oFundraisers();
  console.log(fundraiserInfo);

  // Total number of goals for groups
  const totalGoals = groups.reduce((total, group) => {
    // Convert the goal to a number if it's not null
    const goal = group.goal ? parseInt(group.goal, 10) : 0;
    return total + goal;
  }, 0);

  // Money received
  const totalReceived = fundraiserInfo.reduce((total, fundraiser) => {
    const moneyIn = fundraiser.money_received
      ? parseInt(fundraiser.money_received, 10)
      : 0;
    return total + moneyIn;
  }, 0);

  // To prevent rendering multiple times
  const goalData = {
    totalGoals: totalGoals,
    totalReceived: totalReceived,
    groups: fundraiserInfo.reduce(
      (acc, fundraiser) => acc.concat(fundraiser.groups),
      []
    ),
    fundraiserInfo: fundraiserInfo.reduce(
      (acc, fundraiser) => acc.concat(fundraiser),
      []
    ),
  };

  return (
    <>
      <Card elevation={3} className="goals-display-card">
        <CardContent>
          <Typography
            variant="h6"
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            Details
          </Typography>
          <div
            className={`org-detail-goal-container ${
              fundraiserInfo && fundraiserInfo.length > 0
                ? ""
                : "no-fundraisers-bg"
            }`}
          >
            {/* <div>
                  <AddGroupPopover info={info} />
                </div> */}
            <center>
              {/* <br /> */}
              {fundraiserInfo && fundraiserInfo.length > 0 ? (
                <TableGroupDetails
                  key="goalData" // Set a key to force re-render when data changes
                  totalGoals={goalData.totalGoals}
                  totalReceived={goalData.totalReceived}
                  groups={goalData.groups}
                  fundraiserInfo={goalData.fundraiserInfo}
                />
              ) : (
                <div className="no-fundraisers-container">
                  <Typography>No Fundraisers Available</Typography>
                </div>
              )}
            </center>
          </div>
          <div>
            <AddGroupPopover info={info} onChange={handleAddGroup} />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
