import React from "react";
import { InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { userOptions } from "../Utils/userOptions";

export default function AssignSelect({ selectedUser, onUserChange }) {
  const handleChange = (event) => {
    onUserChange(event.target.value);
  };

  return (
    <FormControl variant="standard" sx={{ minWidth: 225 }}>
      <InputLabel>Change to:</InputLabel>
      <Select
        labelId="assigned-to-task"
        id="select-user-assigned-to-task"
        value={selectedUser}
        onChange={handleChange}
        label="Assigned:"
      >
        {userOptions.map((user, i) => (
          <MenuItem key={i} value={user}>
            {user}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
