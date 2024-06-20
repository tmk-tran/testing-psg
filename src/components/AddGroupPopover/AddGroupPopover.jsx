import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// Style
import {
  Box,
  Button,
  TextField,
  Typography,
  Popover,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material/";
import AddBoxIcon from "@mui/icons-material/AddBox";
import "./AddGroupPopover.css";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { border } from "../Utils/colors";
import { showSaveSweetAlert } from "../Utils/sweetAlerts";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import ModalButtons from "../Modals/ModalButtons";

export default function BasicPopover({ info, groups, onChange }) {
  const dispatch = useDispatch();
  // state for the popover
  const [anchorEl, setAnchorEl] = useState(null);
  // state for the add group form
  const [orgId, setOrgId] = useState(info.organization_id);
  const [groupName, setGroupName] = useState("");
  const [department, setDepartment] = useState("");
  const [subDepartment, setSubDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [groupLeadName, setGroupLeadName] = useState("");
  const [groupLeadEmail, setGroupLeadEmail] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isMobile = useMediaQuery(useTheme().breakpoints.down("sm"));

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleSave = () => {
    const groupInfo = {
      organization_id: orgId,
      department: department,
      sub_department: subDepartment,
      group_nickname: groupName,
      group_description: description,
    };

    dispatch({ type: "ADD_GROUP", payload: groupInfo });

    setGroupName("");
    setDepartment("");
    setSubDepartment("");
    setDescription("");
    onChange();
    showSaveSweetAlert({ label: "Group Added" });
    handleClose();
  };

  return (
    <div className="popover-container">
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ Add group button ~~~~~~~~~~ */}
      <Tooltip title="Add a new group">
        <Button id="add-group-button" onClick={handleClick} fullWidth>
          <AddBoxIcon />
          &nbsp;Group
          {/* Add Group */}
        </Button>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => {}}
        anchorOrigin={{
          vertical: isMobile ? "top" : "bottom",
          horizontal: isMobile ? "center" : "center",
        }}
        transformOrigin={{
          vertical: isMobile ? "bottom" : "bottom",
          horizontal: isMobile ? "center" : "center",
        }}
        // anchorOrigin={{
        //   vertical: isMobile ? "top" : "top",
        //   horizontal: isMobile ? "center" : "center",
        // }}
        // transformOrigin={{
        //   vertical: isMobile ? "bottom" : "top",
        //   horizontal: isMobile ? "center" : "center",
        // }}
      >
        <Box style={{ padding: "20px", width: "48vh" }}>
          <div>
            <Typography
              variant="h6"
              sx={{ p: 1, textAlign: "center", fontWeight: "bold" }}
            >
              Add New Group
            </Typography>
          </div>
          <div>
            <div className="add-group-fields">
              <TextField
                fullWidth
                label="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <TextField
                fullWidth
                label="Category"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <TextField
                fullWidth
                label="Sub-Category"
                value={subDepartment}
                onChange={(e) => setSubDepartment(e.target.value)}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {/* ~~~~~~~~~~ GROUP LEAD NAME ~~~~~~~~~~ */}
              {/* <TextField
                label="Group Leader Name"
                fullWidth
                value={groupLeadName}
                onChange={(e) => setGroupLeadName(e.target.value)}
              /> */}
              {/* ~~~~~~~~~~ GROUP LEAD EMAIL ~~~~~~~~~ */}
              {/* <TextField
                label="Group Leader Email"
                fullWidth
                value={groupLeadEmail}
                onChange={(e) => setGroupLeadEmail(e.target.value)}
              /> */}
            </div>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~ Buttons ~~~~~~~~~~ */}
            <ModalButtons
              label="Save"
              onSave={handleSave}
              onCancel={handleClose}
              sx={{ mt: 2 }}
              width="50%"
            />
          </div>
        </Box>
      </Popover>
    </div>
  );
}
