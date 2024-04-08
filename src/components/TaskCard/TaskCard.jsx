import React, { useState } from "react";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import "./TaskCard.css";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import EditIcon from "@mui/icons-material/Edit";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { historyHook } from "../../hooks/useHistory";
import { dispatchHook } from "../../hooks/useDispatch";
import { mComments } from "../../hooks/reduxStore";
import {
  successColor,
  hoverAccept,
  primaryColor,
  dueDateHighlight,
  whiteBackground,
} from "../Utils/colors";
import {
  capitalizeFirstWord,
  capitalizeWords,
  formatDate,
  handleDateChange,
} from "../Utils/helpers";
// ~~~~~~~~~~ Components ~~~~~~~~~~
import TaskDropdown from "./TaskDropdown";
import CommentDisplay from "../CommentDisplay/CommentDisplay";
import AssignSelect from "./AssignSelect";
import { useSelector } from "react-redux";
import { showSaveSweetAlert } from "../Utils/sweetAlerts";
import { flexCenter, flexRowSpace } from "../Utils/pageStyles";
import TaskCardButtons from "./TaskCardButtons";
import DatePicker from "../DatePicker/DatePicker";

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

const iconButtonStyle = {
  mt: 3,
  ml: 1,
  color: primaryColor.color,
};

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
  const [assignedUser, setAssignedUser] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = dispatchHook();  
  const [isDateEdit, setIsDateEdit] = useState(false);
  const [newDueDate, setNewDueDate] = useState("");

  console.log(assignedUser);
  const auth = useSelector((store) => store.auth)
  console.log(task)
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

    
    const dispatchAction = {
      type: updateActionType,
      payload: { updatedTask: {
        id: task.id,
        task: task.task,
        assign: task.assign,
        due_date: task.due_date,
        task_status: selectedTask},
        auth: auth,
      },
    };
    console.log(dispatchAction);
    dispatch(dispatchAction);
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

  const handleDateEdit = () => {
    setIsDateEdit(true);
  };

  const returnNewDate = (newDate) => {
    handleDateChange(newDate, setNewDueDate);
  };

  const saveNewDueDate = () => {
    const action = {
      type: "CHANGE_DUE_DATE",
      payload: {
        id: task.id,
        due_date: newDueDate,
        merchantId: mId,
      },
    };
    console.log(action);
    dispatch(action);
    clearDateField();
  };

  const clearDateField = () => {
    setNewDueDate("");
    setIsDateEdit(false);
  };
  console.log(newDueDate);
  console.log(isDateEdit);

  const handleEditMode = () => {
    setIsEditing(true);
  };

  const handleCloseEditMode = () => {
    setIsEditing(false);
  };

  const assignNewUser = () => {
    if (assignedUser && taskType === "merchant") {
      const dispatchAction = {
        type: "CHANGE_ASSIGNED_TO",
        payload: {
          id: task.id,
          assign: assignedUser,
          merchantId: mId,
        },
      };
      console.log(dispatchAction);
      dispatch(dispatchAction);
    }
    if (assignedUser && taskType === "organization") {
      const dispatchAction2 = {
        type: "CHANGE_ASSIGNED_ORG",
        payload: {
          id: task.id,
          assign: assignedUser,
          organizationId: oId,
        },
      };
      console.log(dispatchAction2);
      dispatch(dispatchAction2);
    }
    onTaskUpdate();
    handleCloseEditMode();
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

                <div style={isDateEdit ? whiteBackground : dueDateHighlight}>
                  {isDateEdit ? (
                    <>
                      <DatePicker
                        initialDate={task.due_date}
                        onChange={returnNewDate}
                        hideInputLabel
                      />
                      <Box sx={{ backgroundColor: "white" }}>
                        <TaskCardButtons
                          onSave={saveNewDueDate}
                          onCancel={clearDateField}
                        />
                      </Box>
                    </>
                  ) : (
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        width: "9vw",
                        textAlign: "center",
                        mt: 0.5,
                        display: "inline-flex",
                      }}
                    >
                      Due: {formatDate(task.due_date)}
                    </Typography>
                  )}
                  {!isDateEdit && (
                    <Tooltip title="Select a Due Date">
                      <IconButton
                        onClick={handleDateEdit}
                        sx={{
                          // ...iconButtonStyle,
                          display: isEditing ? "none" : "inline-flex", // Hide when editing
                        }}
                      >
                        <EditCalendarIcon sx={{ fontSize: 23 }} />
                      </IconButton>
                    </Tooltip>
                  )}
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
                  <Box sx={flexCenter}>
                    {isEditing ? (
                      <Box sx={flexColumn}>
                        <AssignSelect
                          selectedUser={assignedUser}
                          onUserChange={setAssignedUser}
                        />
                        {/* ~~~~~ Buttons for assigned user ~~~~~ */}
                        <TaskCardButtons
                          onSave={assignNewUser}
                          onCancel={handleCloseEditMode}
                        />
                      </Box>
                    ) : (
                      <Typography sx={{ textAlign: "center", mt: 3 }}>
                        <strong>Assigned to: </strong>
                        {task.assign}
                      </Typography>
                    )}
                    {!isEditing && (
                      <Tooltip title="Change Assignment">
                        <IconButton
                          onClick={handleEditMode}
                          sx={{
                            ...iconButtonStyle,
                            display: isEditing ? "none" : "inline-flex", // Hide when editing
                          }}
                        >
                          <EditIcon sx={{ fontSize: 23 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
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
                      `/fargo/${
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
