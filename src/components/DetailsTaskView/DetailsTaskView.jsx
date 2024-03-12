import React, { useEffect } from "react";
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
import { useSelector } from "react-redux";

export default function DetailsTaskView({ caseType }) {
  const dispatch = dispatchHook();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  console.log(caseType);
  const merchantId = useParams();
  console.log(merchantId);
  const mId = merchantId.id;
  console.log(mId);
  const auth = useSelector((store) => store.auth);

  // useEffect(() => {
  //   dispatch({ type: "FETCH_MERCHANT_COMMENTS", payload: mId });

  //   dispatch({
  //     type: "FETCH_MERCHANT_TASKS",
  //     payload: mId,
  //   });
  // }, [dispatch, mId]);

  useEffect(() => {
    if (caseType === "orgTaskView") {
      dispatch({
        type: "FETCH_ORGANIZATION_TASKS",
        payload: {id: mId,
          auth: auth}
      });
    } else {
      dispatch({ type: "FETCH_MERCHANT_COMMENTS", payload: {id: mId, auth: auth} });
      dispatch({ type: "FETCH_MERCHANT_TASKS", payload: {id: mId, auth: auth} });
    }
  }, [mId, caseType]); // Deleted dispatch from dependencies

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
            <TableTaskDetails caseType={caseType} mId={mId} />
          </div>

          <div>
            {caseType === "merchantView" ? (
              // Render NewTaskModal with 'merchantTab' props
              <NewTaskModal
                tabs={false}
                customIcon={<AddBoxIcon />}
                customText="Task"
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
