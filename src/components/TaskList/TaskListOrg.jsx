import React, { useState, useEffect } from "react";
// ~~~~~~~~~~ Style ~~~~~~~~~~ //
import {
  CircularProgress,
  Typography,
  MenuItem,
  Select,
  Box,
} from "@mui/material";
import "./TaskList.css";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import TaskCard from "../TaskCard/TaskCard";
import SuccessAlert from "../SuccessAlert/SuccessAlert";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { oTasks } from "../../hooks/reduxStore";
import { useAlert } from "../SuccessAlert/useAlert";
import { spinnerSx } from "../TaskTabs/TaskTabs";

export default function TaskListOrg({ isLoading, loadComplete }) {
  const [selectedTasks, setSelectedTasks] = useState({
    newTask: "",
    inProgressTask: "",
    completeTask: "",
  });
  const [caseType, setCaseType] = useState("");

  const { isAlertOpen, handleAlertClose, handleTaskUpdate } = useAlert();

  const orgTasks = oTasks() || [];

  // Set isLoading to false when the tasks are loaded
  useEffect(() => {
    if (orgTasks.length > 0 || orgTasks.length === 0) {
      loadComplete(); // Indicate that loading is complete even if there are no tasks
    }
  }, [orgTasks]);

  // Set isLoading to false when the tasks are loaded
  useEffect(() => {
    if (orgTasks.length > 0) {
      loadComplete();
    }
  }, [orgTasks]);

  // Group tasks by task_status (case-insensitive)
  // Check if orgTasks is an array before using reduce
  const tasksByStatus = Array.isArray(orgTasks)
    ? orgTasks.reduce((acc, task) => {
        const statusKey = task.task_status.toLowerCase();
        acc[statusKey] = acc[statusKey] || [];
        acc[statusKey].push(task);
        return acc;
      }, {})
    : {};

  // Sort tasks within each category
  const sortedNewTasks = tasksByStatus["new"] || [];
  const sortedInProgressTasks = tasksByStatus["in progress"] || [];
  const sortedCompleteTasks = tasksByStatus["complete"] || [];

  const handleCaseTypeChange = (newValue) => {
    setCaseType(newValue);
  };

  return (
    <Box className="list-container">
      <SuccessAlert
        isOpen={isAlertOpen}
        onClose={handleAlertClose}
        caseType={caseType}
      />
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~ Dropdown for New Tasks ~~~~~~~~ */}
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <Select
        value={selectedTasks.newTask}
        onChange={(e) =>
          setSelectedTasks({ ...selectedTasks, newTask: e.target.value })
        }
        displayEmpty
        renderValue={() => (
          <Typography>
            {"New"}&nbsp;
            {`(${sortedNewTasks.length})`}
            {isLoading && <CircularProgress sx={spinnerSx} size={16} />}
          </Typography>
        )}
        // renderValue={() => (
        //   <Typography fontWeight={!isNewTasksMenuOpen ? "bold" : "normal"}>
        //     {"New"}&nbsp;
        //     {`(${sortedNewTasks.length})`}
        //     {isNewTasksMenuOpen && <span style={{ marginLeft: "5px" }}>New!</span>}
        //   </Typography>
        // )}
        // onOpen={handleMenuOpen}
        MenuProps={{ disableAutoFocusItem: true }}
      >
        {sortedNewTasks.map((task, i) => (
          <MenuItem key={task.id} value={i + 1} disableRipple>
            {/* Display the task number along with task information */}
            <Typography variant="h6">{`#${i + 1} - `}&nbsp;</Typography>
            <TaskCard
              task={task}
              taskType="organization"
              index={i}
              onTaskUpdate={handleTaskUpdate}
            />
          </MenuItem>
        ))}
      </Select>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~ Dropdown for In Progress Tasks ~~~~~~~~ */}
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <Select
        value={selectedTasks.inProgressTask}
        onChange={(e) =>
          setSelectedTasks({ ...selectedTasks, inProgressTask: e.target.value })
        }
        displayEmpty
        renderValue={() => (
          <Typography>
            {"In Progress"}&nbsp;
            {`(${sortedInProgressTasks.length})`}
            {isLoading && <CircularProgress sx={spinnerSx} size={16} />}
          </Typography>
        )}
      >
        {sortedInProgressTasks.map((task, i) => (
          <MenuItem key={task.id} value={i + 1} disableRipple>
            <Typography variant="h6">{`#${i + 1} - `}&nbsp;</Typography>
            <TaskCard
              task={task}
              taskType="organization"
              index={i}
              onTaskUpdate={handleTaskUpdate}
            />
          </MenuItem>
        ))}
      </Select>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~ Dropdown for Complete Tasks ~~~~~~~~ */}
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <Select
        value={selectedTasks.completeTask}
        onChange={(e) =>
          setSelectedTasks({ ...selectedTasks, completeTask: e.target.value })
        }
        displayEmpty
        renderValue={() => {
          const nonDeletedTasks = sortedCompleteTasks.filter(
            (task) => !task.is_deleted
          );
          return (
            <Typography>
              {"Complete"}&nbsp;
              {`(${nonDeletedTasks.length})`}
              {isLoading && <CircularProgress sx={spinnerSx} size={16} />}
            </Typography>
          );
        }}
      >
        {sortedCompleteTasks
          .filter((task) => !task.is_deleted)
          .map((task, i) =>
            !task.is_deleted ? (
              <MenuItem key={task.id} value={i + 1} disableRipple>
                <Typography variant="h6">{`#${i + 1} - `}&nbsp;</Typography>
                <TaskCard
                  id={task.id}
                  task={task}
                  taskType="organization"
                  index={i}
                  onTaskUpdate={handleTaskUpdate}
                  handleCaseTypeChange={handleCaseTypeChange}
                />
              </MenuItem>
            ) : null
          )}
      </Select>
    </Box>
  );
}
