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
  console.log(task);

  const [taskStatus, setTaskStatus] = useState(task ? task.task_status : "");
  console.log(taskStatus);
  // Change name to: task description
  const [status, setStatus] = useState(task ? task.task : "");
  console.log(status);

  const [taskId, setTaskId] = useState(task ? task.id : "");
  console.log(taskId);
  const [assignedCouponId, setAssignedCouonId] = useState(
    task ? task.coupon_id : ""
  );
  console.log(assignedCouponId);

  console.log(couponId);

  const handleMenuChange = (event) => {
    console.log(event.target);
    const choice = event.target.value;
    setStatus(choice);
    console.log(choice);

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
    handleUpdateTask(taskId, couponId, choice, newTaskStatus);
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
