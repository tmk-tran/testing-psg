import React, { useState } from "react";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import { Card, CardContent, Typography, Button } from "@mui/material";
import "./TaskCard.css";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { historyHook } from "../../hooks/useHistory";
import {
  successColor,
  hoverAccept,
  border,
  primaryColor,
  dueDateHighlight,
} from "../Utils/colors";
import {
  capitalizeFirstWord,
  capitalizeWords,
  formatDate,
} from "../Utils/helpers";
// ~~~~~~~~~~ Components ~~~~~~~~~~
import TaskDropdown from "./TaskDropdown";
import CommentDisplay from "../CommentDisplay/CommentDisplay";
import { dispatchHook } from "../../hooks/useDispatch";
import { mComments } from "../../hooks/reduxStore";
import { useSelector } from "react-redux";

export default function TaskCard({
  id,
  task,
  taskType,
  index,
  onTaskUpdate,
  handleCaseTypeChange,
}) {
  // console.log(id);
  // console.log(taskType);
  const [selectedTask, setSelectedTask] = useState(null);
  // console.log(task);
  // console.log(task.id);
  // console.log(task.merchant_id);
  // console.log(task.organization_id);
  const oId = task.organization_id;
  const mId = task.merchant_id;
  // console.log(mId);
  // console.log(oId);
  // console.log(index);
  // console.log(task.task_status);
  const complete = task.task_status;
  // console.log(complete);
  const [completedTask, setCompletedTask] = useState(complete === "Complete");
  // console.log(completedTask);
  const history = historyHook();
  const dispatch = dispatchHook();
  const auth = useSelector((store) => store.auth)

  // Comments
  const merchantComments = mComments(mId) || [];
  console.log(merchantComments);

  const matchingComment = merchantComments.find(
    (comment) => comment.id === task.id
  );

  if (matchingComment) {
    console.log("Found matching comment:", matchingComment);
  } else {
    console.log("No matching comment found for task_id:", task.id);
  }

  const handleTaskChange = (taskStatus) => {
    console.log(taskStatus);
    setSelectedTask(taskStatus); // Update selectedTask with the value received from TaskDropdown
  };

  const handleCardClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTaskUpdate = () => {
    const updateActionType =
      taskType === "organization"
        ? "UPDATE_ORGANIZATION_TASK"
        : "UPDATE_MERCHANT_TASK";

    console.log(updateActionType);
    console.log(task.id);
    console.log(selectedTask);
    dispatch({
      type: updateActionType,
      payload: {
        id: task.id,
        task_status: selectedTask,
        auth: auth,
      },
    });
    // Notify the parent component about the task update
    onTaskUpdate();
    // Show the success alert
    // setIsAlertOpen(true);
  };

  const archiveTask = () => {
    console.log(id);

    const archiveActionType =
      taskType === "organization"
        ? "ARCHIVE_ORGANIZATION_TASK"
        : "ARCHIVE_MERCHANT_TASK";

    console.log(archiveActionType);
    console.log(task.id);
    dispatch({
      type: archiveActionType,
      payload: {
        id: task.id,
        auth: auth
      },
    });
    onTaskUpdate();
    handleCaseTypeChange("Archived");
  };

  const fullWidth = {
    width: "100%",
  };

  const flexColumn = {
    display: "flex",
    flexDirection: "column",
  };

  const commentBorder = {
    border: `1px solid ${primaryColor.color}`,
    borderRadius: "5px",
  };

  return (
    <Card
      elevation={5}
      style={{
        backgroundColor: index % 2 === 0 ? "white" : "#e9e9e9bf",
        ...fullWidth,
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                ...flexColumn,
                ...fullWidth,
              }}
            >
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~~~~ MERCHANT / ORG NAME ~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    // fontWeight: "bold",
                    fontSize: "larger",
                    // textAlign: "center",
                    mb: 1,
                  }}
                >
                  <strong>
                    {taskType === "organization" ? "Organization" : "Merchant"}:{" "}
                  </strong>
                  {capitalizeWords(
                    taskType === "organization"
                      ? task.organization_name
                      : task.merchant_name
                  )}
                </Typography>

                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~~~~~~~~~ DATE ~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                <div style={dueDateHighlight}>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      width: "10vw",
                      textAlign: "center",
                      mt: 0.5,
                    }}
                  >
                    Due: {formatDate(task.due_date)}
                  </Typography>
                </div>
                {/* ~~~~~~~~~~~~~~~~ END ~~~~~~~~~~~~~~~~~~~~ */}
              </div>
              {/* May use border here, undecided */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                  {/* ~~~~~~~~~~~~~~~~~ TASK ~~~~~~~~~~~~~~~~~ */}
                  {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                  <div>
                    <Typography sx={{ fontSize: "larger" }}>
                      <strong>Task: </strong> {capitalizeWords(task.task)}
                    </Typography>
                  </div>{" "}
                  {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                  {/* ~~~~~~~~~~~~~~~~~ ASSIGNED ~~~~~~~~~~~~~~~~~ */}
                  {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                  <div>
                    <Typography sx={{ width: "10vw", textAlign: "center" }}>
                      <strong>Assigned to: </strong>
                      {task.assign}
                    </Typography>
                  </div>
                </div>
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~~~~~~ DESCRIPTION ~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                <div>
                  {task.description ? (
                    <Typography sx={{ mb: 1, mt: 1 }}>
                      <strong>Details: </strong>{" "}
                      {capitalizeFirstWord(task.description)}
                    </Typography>
                  ) : (
                    <Typography sx={{ mb: 1, mt: 1 }}>
                      <strong>No details available</strong>
                    </Typography>
                  )}
                </div>
                {/* ~~~~~~~~~~~~~~~~ END~~~~~~~~~~~~~~~~~~~~ */}
              </div>
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~~~~ COMMENTS SECTION ~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              <div style={commentBorder}>
                {matchingComment && (
                  <CommentDisplay
                    comment={matchingComment}
                    showAllComments={false}
                  />
                )}
              </div>
              {/* ~~~~~~~~~~~~~~~~ END~~~~~~~~~~~~~~~~~~~~ */}
            </div>

            <div
              style={{
                ...flexColumn,
                alignItems: "center",
                marginLeft: "20px",
                maxHeight: "200px",
                position: "relative",
              }}
            >
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~~~~ UPDATE TASK ~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {selectedTask ? (
                <Button
                  variant="contained"
                  onClick={handleTaskUpdate}
                  sx={{
                    backgroundColor: successColor.color,
                    ...hoverAccept,
                    height: "30%",
                    maxHeight: "50px",
                    mb: 2,
                  }}
                  fullWidth
                >
                  Update
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() =>
                    history.push(
                      `/${
                        taskType === "organization"
                          ? "organizationTaskDetails"
                          : "merchantTaskDetails"
                      }/${
                        taskType === "organization"
                          ? task.organization_id
                          : task.merchant_id
                      }`
                    )
                  }
                  fullWidth
                  // sx={{ height: "100%" }}
                  sx={{ height: "30%", maxHeight: "50px", mb: 2 }}
                >
                  Details
                </Button>
              )}
              {completedTask ? (
                <Button onClick={archiveTask} fullWidth>
                  Archive
                </Button>
              ) : null}
              {/* ~~~~~~~~~~~~~~~~ END~~~~~~~~~~~~~~~~~~~~ */}
              <div style={{ height: "100%" }}></div>
              <TaskDropdown
                onChange={handleTaskChange}
                taskStatus={task.task_status}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
