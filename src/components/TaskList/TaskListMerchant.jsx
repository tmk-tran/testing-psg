import React, { useState, useEffect } from "react";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import { Typography, MenuItem, Select } from "@mui/material";
import "./TaskList.css";
// ~~~~~~~~~~ Components ~~~~~~~~~~
import TaskCard from "../TaskCard/TaskCard";
import SuccessAlert from "../SuccessAlert/SuccessAlert";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { mTasks } from "../../hooks/reduxStore";
import { dispatchHook } from "../../hooks/useDispatch";
import { useAlert } from "../SuccessAlert/useAlert";

export default function TaskListMerchant() {
  const dispatch = dispatchHook();
  const [selectedTasks, setSelectedTasks] = useState({
    newTask: "",
    inProgressTask: "",
    completeTask: "",
  });
  const [caseType, setCaseType] = useState("");
  console.log(caseType);

  const { isAlertOpen, handleAlertClose, handleTaskUpdate } = useAlert();

  // Tasks
  const merchantTasks = mTasks() || [];
  console.log(merchantTasks);

  useEffect(() => {
    dispatch({ type: "FETCH_ALL_MERCHANT_COMMENTS" });
  }, []);

  // Group tasks by task_status (case-insensitive)
  // Check if merchantTasks is an array before using reduce
  const tasksByStatus = Array.isArray(merchantTasks)
    ? merchantTasks.reduce((acc, task) => {
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
  console.log(sortedCompleteTasks);

  const handleCaseTypeChange = (newValue) => {
    setCaseType(newValue);
  };

  return (
    <div className="list-container">
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~ Dropdown for New Tasks ~~~~~~~~ */}
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <SuccessAlert
        isOpen={isAlertOpen}
        onClose={handleAlertClose}
        caseType={caseType}
      />
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
          </Typography>
        )}
      >
        {sortedNewTasks.map((task, i) => (
          <MenuItem key={task.id} value={i + 1} disableRipple>
            {/* Display the task number along with task information */}
            <Typography variant="h6">{`#${i + 1} - `}&nbsp;</Typography>
            <TaskCard
              task={task}
              taskType="merchant"
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
          </Typography>
        )}
      >
        {sortedInProgressTasks.map((task, i) => (
          <MenuItem key={task.id} value={i + 1} disableRipple>
            <Typography variant="h6">{`#${i + 1} - `}&nbsp;</Typography>
            <TaskCard
              task={task}
              taskType="merchant"
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
                  taskType="merchant"
                  index={i}
                  onTaskUpdate={handleTaskUpdate}
                  handleCaseTypeChange={handleCaseTypeChange}
                />
              </MenuItem>
            ) : null
          )}
      </Select>
    </div>
  );
}
