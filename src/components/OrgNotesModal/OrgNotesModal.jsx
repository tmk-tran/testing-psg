import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// Style
import {
  Box,
  Button,
  TextField,
  Popover,
  useTheme,
  useMediaQuery,
} from "@mui/material/";
import "./OrgNotesModal.css";
// Icons
import EditIcon from "@mui/icons-material/Edit";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~~~~~ //
import { showSaveSweetAlert } from "../Utils/sweetAlerts";
// For Toast (INACTIVE)
import { showToast } from "../Utils/toasts";
import { flexRowSpace } from "../Utils/pageStyles";

export default function NotesPopover({ info }) {
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth)
  const paramsObject = useParams();
  // state for the popover
  const [anchorEl, setAnchorEl] = useState(null);
  // state for the add group form
  const [orgId, setOrgId] = useState(info.organization_id);
  const [newNote, setNewNote] = useState("");
  const [noteDate, setNoteDate] = useState(new Date());
  const [noteAdded, setNoteAdded] = useState(false);

  const isMobile = useMediaQuery(useTheme().breakpoints.down("sm"));
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    // Fetch org notes whenever noteAdded changes
    dispatch({
      type: "FETCH_ORG_NOTES",
      payload: {id: paramsObject.id,
        auth: auth}
    });

    console.log(orgId)

    // Reset noteAdded after fetching data
    setNoteAdded(false);
  }, [paramsObject.id, noteAdded]); // Deleted dispatch from dependencies

  const handleSave = () => {
    // Format the date as "mm/dd/yyyy"
    const formattedDate = noteDate.toLocaleDateString("en-US");

    const sendNote = {
      organization_id: orgId,
      note_date: formattedDate,
      note_content: newNote,
    };

    const saveCall = () => {
      dispatch({ type: "ADD_ORG_NOTES", payload: {sendNote: sendNote, auth: auth} });
      setNoteAdded(true);
    };

    // Toast
    // showToast();
    saveCall();
    // Sweet Alert
    showSaveSweetAlert({ label: "Note Added" });

    setNewNote("");
    handleClose();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="popover-notes-container">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ flexGrow: 1 }}></div>
        {/* <TextField style={{ height: "5px" }}></TextField> */}
        <Button id="add-note-button" variant="contained" onClick={handleClick}>
          <EditIcon />
          {/*&nbsp;Note*/}
        </Button>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        // onClose={handleClose}
        onClose={() => {}}
        anchorOrigin={{
          vertical: isMobile ? "top" : "top",
          horizontal: isMobile ? "center" : "center",
        }}
        transformOrigin={{
          vertical: isMobile ? "bottom" : "bottom",
          horizontal: isMobile ? "center" : "center",
        }}
      >
        <Box style={{ padding: "20px" }}>
          <div>
            <div className="add-notes">
              <TextField
                fullWidth
                label="New Note"
                multiline
                rows={4}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              ></TextField>
            </div>
            <div style={flexRowSpace}>
              <Button className="modal-cancel-btn" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </Box>
      </Popover>
    </div>
  );
}
