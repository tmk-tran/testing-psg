import React, { useState, useEffect } from "react";
import { Select, MenuItem } from "@mui/material";

const statusOptions = [
  "*New Year: Merchant Coupon",
  "Add-on Request",
  "Changes Requested",
  "Completed Coupon",
  "Edit Proof",
  "New: Add-on Proof",
  "New: Create Proof",
  "Pending Merchant Approval",
  "Proof Approved",
  "Ready For Review",
  "Update Create Proof",
];

export default function CouponStatusDropdown({
  couponId,
  width = "100%",
  handleUpdateTask,
  onChange,
  complete,
  task,
}) {
  // Change name to: task description
  const [status, setStatus] = useState(task ? task.task : "");
  const [taskId, setTaskId] = useState(task ? task.id : "");

  const handleMenuChange = (event) => {
    const choice = event.target.value;
    setStatus(choice);

    let newTaskStatus;
    if (choice === "Changes Requested") {
      onChange(true);
      newTaskStatus = "Changes Requested";
    } else if (
      choice === "New: Create Proof" ||
      choice === "New: Add-on Proof"
    ) {
      newTaskStatus = "New";
    } else if (choice === "Completed Coupon") {
      onChange(false);
      complete(true);
      newTaskStatus = "Complete";
    } else {
      onChange(false);
      complete(false);
      newTaskStatus = "In Progress";
    }

    // Pass the updated taskStatus to the parent
    {
      couponId
        ? handleUpdateTask(taskId, couponId, choice, newTaskStatus)
        : handleUpdateTask(taskId, choice, newTaskStatus);
    }
  };

  return (
    <Select
      value={status}
      // onChange={handleMenuChange}
      onChange={(event) => {
        handleMenuChange(event);
      }}
      style={{
        width: width,
        textAlign: "center",
        marginLeft: "unset",
        overflow: "hidden",
        backgroundColor: "white",
      }}
      displayEmpty
    >
      <MenuItem value={status} disabled>
        {status || "Change Status"}
      </MenuItem>
      {statusOptions.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
}
