import React, { useState } from "react";
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
  width = "100%",
  handleUpdateTask,
  onChange,
  complete,
  task,
}) {
  const defaultTask = task ? task.task : ""; // Default to an empty string if task is undefined
  const defaultStatus = task ? task.task_status : "";
  const defaultId = task ? task.id : "";
  const [status, setStatus] = useState(defaultTask);
  console.log(status);
  const [taskStatus, setTaskStatus] = useState(defaultStatus);
  console.log(taskStatus);
  const [couponId, setCouponId] = useState(defaultId);
  console.log(couponId);

  status === "Changes Requested" ? onChange(true) : onChange(false);
  status === "Completed Coupon" ? complete(true) : complete(false);

  const handleMenuChange = (event) => {
    console.log(event.target);
    const choice = event.target.value;
    setStatus(choice);
    // choice === "Changes Requested" ? onChange() : null;
    console.log(choice);

    // Pass both the selected status and isTaskUpdate state to the parent
    handleUpdateTask(couponId, choice, taskStatus);
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
