import React, { useState } from "react";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import { Card, CardContent, Typography, Button } from "@mui/material";
import "./TaskCard.css";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { historyHook } from "../../hooks/useHistory";
import { successColor, hoverAccept, border } from "../Utils/colors";
import { formatDate } from "../Utils/helpers";
import { dueDateHighlight } from "../Utils/colors";
// ~~~~~~~~~~ Components ~~~~~~~~~~
import TaskDropdown from "./TaskDropdown";
import CommentDisplay from "../CommentDisplay/CommentDisplay";

export default function TaskCardMerchant({ task }) {
  console.log(task);
  const [selectedTask, setSelectedTask] = useState(null);

  const history = historyHook();

  const handleTaskChange = (taskStatus) => {
    setSelectedTask(taskStatus); // Update selectedTask with the value received from TaskDropdown
  };

  const handleCardClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const fullWidth = {
    width: "100%",
  };

  const flexColumn = {
    display: "flex",
    flexDirection: "column",
  };

  return (
    <Card style={fullWidth} onClick={handleCardClick}>
      <CardContent>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div
              style={{
                ...flexColumn,
                ...fullWidth,
              }}
            >
              {/* MERCHANT NAME */}
              <div className="name-section">
                <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
                  Name: {task.merchant_name}
                </Typography>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {/* TASK */}
                  <div>
                    <Typography>Task: {task.task}</Typography>
                  </div>{" "}
                  {/* DATE */}
                  <div style={{ marginRight: "10px", ...dueDateHighlight }}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Due: {formatDate(task.due_date)}
                    </Typography>
                  </div>
                </div>
                {/* DESCRIPTION */}
                <div className="task-description-section">
                  Details: {task.description}
                </div>
              </div>
              {/* COMMENT SECTION */}
              <div style={border}>
                <CommentDisplay />
              </div>
            </div>

            <div
              style={{
                ...flexColumn,
                alignItems: "center",
              }}
            >
              {/* NEED to add an ID here to associate to specific task on next view */}
              {selectedTask ? (
                <Button
                  variant="contained"
                  onClick={() =>
                    console.log("Update clicked for", selectedTask)
                  }
                  sx={{ backgroundColor: successColor.color, ...hoverAccept }}
                  fullWidth
                >
                  Update
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => history.push(`/merchantTaskDetails/${task.merchant_id}`)}
                  fullWidth
                >
                  Details
                </Button>
              )}

              <TaskDropdown onChange={handleTaskChange} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
