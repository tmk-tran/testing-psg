import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Typography,
} from "@mui/material";
import "./TableTaskDetails.css";
import CommentDisplay from "../CommentDisplay/CommentDisplay";
import { mTasks, mComments, oTasks } from "../../hooks/reduxStore";
import { dispatchHook } from "../../hooks/useDispatch";
import { capitalizeWords, formatDate } from "../Utils/helpers";
import { disabledColor, dueDateHighlight } from "../Utils/colors";

export default function TableTaskDetails({ mId, caseType }) {
  const dispatch = dispatchHook();
  const merchantTasks = mTasks() || [];
  const comments = mComments();
  const orgTasks = oTasks();

  const toDoTasks = merchantTasks.filter(
    (task) => task.task_status !== "Complete"
  );

  const toDoTasksOrg = orgTasks.filter(
    (task) => task.task_status !== "Complete"
  );

  const fullWidth = {
    width: "100%",
  };

  const boldCenter = {
    fontWeight: "bold",
    textAlign: "center",
  };

  // useEffect(() => {
  //   dispatch({ type: "FETCH_MERCHANT_COMMENTS", payload: mId });

  //   dispatch({
  //     type: "FETCH_MERCHANT_TASKS",
  //     payload: mId,
  //   });
  // }, [mId]); // Deleted dispatch from dependencies
  // useEffect(() => {
  //   dispatch({
  //     type: "FETCH_MERCHANT_TASKS",
  //     payload: mId,
  //   });
  // }, [mId]);

  useEffect(() => {
    // Check if tasks are loaded before fetching comments
    if (Array.isArray(merchantTasks) && merchantTasks.length > 0) {
      dispatch({
        type: "FETCH_MERCHANT_COMMENTS",
        payload: mId,
      });
    }
  }, [merchantTasks, mId]);

  const renderTask = (task, index) => {
    const taskComments =
      comments && Array.isArray(comments)
        ? comments.filter((comment) => comment.task_id === task.id)
        : [];

    const displaySingleComment = taskComments.length > 0;

    return (
      <div key={index} className="task-row-shading">
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={3}
              style={{ ...fullWidth, padding: 0, border: "none" }}
            >
              <Typography
                variant="body1"
                sx={{
                  ...boldCenter,
                  textDecoration: "underline",
                }}
              >
                #{index + 1}: &nbsp;{capitalizeWords(task.task)}
              </Typography>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell
              style={{
                ...fullWidth,
                border: "none",
                padding: 0,
              }}
            >
              <Typography variant="body2" sx={boldCenter}>
                Status:
                <span style={{ marginLeft: "15px" }}>
                  {capitalizeWords(task.task_status)}
                </span>
              </Typography>
            </TableCell>

            <TableCell
              style={{
                border: "none",
              }}
              colSpan={2}
            >
              {task.due_date ? (
                <Typography
                  variant="body2"
                  sx={{
                    ...boldCenter,
                    ...dueDateHighlight,
                  }}
                >
                  Due:
                  <span style={{ marginLeft: "15px" }}>
                    {formatDate(task.due_date)}
                  </span>
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "nowrap",
                    ...boldCenter,
                    ...dueDateHighlight,
                  }}
                >
                  No due date set
                </Typography>
              )}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell colSpan={3} style={fullWidth}>
              {displaySingleComment && (
                <CommentDisplay
                  key={taskComments[0].id}
                  comment={taskComments[0]}
                  showAllComments={false}
                />
              )}
              <hr />
            </TableCell>
          </TableRow>
        </TableBody>
      </div>
    );
  };

  return (
    <>
      {caseType === "orgTaskView" ? (
        toDoTasksOrg.length === 0 ? (
          <Typography sx={{ textAlign: "center" }}>No current tasks</Typography>
        ) : (
          <Table>
            <TableBody>{toDoTasksOrg.map(renderTask)}</TableBody>
          </Table>
        )
      ) : toDoTasks.length === 0 ? (
        <div
          style={{
            minHeight: "80px",
            backgroundColor: disabledColor.color,
            padding: "20%",
          }}
        >
          <Typography sx={{ textAlign: "center" }}>No current tasks</Typography>
        </div>
      ) : (
        <Table>
          <TableBody>{toDoTasks.map(renderTask)}</TableBody>
        </Table>
      )}
    </>
  );
}
