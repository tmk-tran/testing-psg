import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import { Typography, Card, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TableTaskDetails from "../TableTaskDetails/TableTaskDetails";
import NewTaskModal from "../NewTaskModal/NewTaskModal";
import AddBoxIcon from "@mui/icons-material/AddBox";
import "./DetailsTaskView.css";
// ~~~~~~~~~~ Utils ~~~~~~~~~~
import { dispatchHook } from "../../hooks/useDispatch";
import { mTasks } from "../../hooks/reduxStore";

export default function DetailsTaskView({ caseType }) {
  const dispatch = dispatchHook();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const merchantId = useParams();
  const mId = merchantId.id;

  useEffect(() => {
    if (caseType === "orgTaskView") {
      dispatch({
        type: "FETCH_ORGANIZATION_TASKS",
        payload: mId,
      });
    }
    // } else {
    //   dispatch({ type: "FETCH_MERCHANT_COMMENTS", payload: mId });
    //   // dispatch({ type: "FETCH_MERCHANT_TASKS", payload: mId });
    // }
  }, [mId, caseType]);

  return (
    <div className={`details-container ${isSmallScreen ? "small-screen" : ""}`}>
      <Card elevation={3} className="goals-display-card">
        <CardContent>
          <Typography
            variant="h6"
            sx={{ textAlign: "center", mb: 1, fontWeight: "bold" }}
          >
            Tasks
          </Typography>
          <div
            // style={{ height: "28vh" }}
            className={`task-display-container ${
              caseType === "merchantView" ? "merchant-task-view" : ""
            }`}
          >
            <TableTaskDetails caseType={caseType} mId={mId} merchantTasks={merchantTasks} />
          </div>

          <div>
            {caseType === "merchantView" ? (
              // Render NewTaskModal with 'merchantTab' props
              <NewTaskModal
                tabs={false}
                customIcon={<AddBoxIcon />}
                customText="Task"
                merchantTab={true}
                caseType={"merchantView"}
              />
            ) : (
              // Render regular NewTaskModal
              <NewTaskModal
                tabs={false}
                customIcon={<AddBoxIcon />}
                customText="Task"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
