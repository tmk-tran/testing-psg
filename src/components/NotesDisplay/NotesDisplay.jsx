import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import {
  Button,
  Typography,
  Card,
  CardContent,
  TextField,
  Tooltip,
} from "@mui/material";
import "./NotesDisplay.css";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// ~~~~~~~~~~ Icons ~~~~~~~~~~
import DeleteIcon from "@mui/icons-material/Delete";
// ~~~~~~~~~~ Utils ~~~~~~~~~~
import { formatDate, hrStyle } from "../Utils/helpers";
import { showSaveSweetAlert, showDeleteSweetAlert } from "../Utils/sweetAlerts";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { dispatchHook } from "../../hooks/useDispatch";
import { disabledColor } from "../Utils/colors";
import { useSelector } from "react-redux";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import LoadingSpinner from "../HomePage/LoadingSpinner";

export default function NotesDisplay({
  isNotesLoading,
  notes,
  details,
  caseType,
  isMerchantTaskPage,
}) {
  console.log(isMerchantTaskPage);
  console.log(notes);
  console.log(details);
  console.log(caseType);
  console.log(notes);

  const dispatch = dispatchHook();
  const auth = useSelector((store) => store.auth);
  const paramsObject = useParams();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // State for showing notes
  const [inputValue, setInputValue] = useState("");
  // State from popover
  // const [orgId, setOrgId] = useState(details.organization_id);
  const [orgId, setOrgId] = useState(
    !isMerchantTaskPage ? details.id : details.id
  );
  console.log(orgId);
  const [noteDate, setNoteDate] = useState(new Date());
  const [noteAdded, setNoteAdded] = useState(false);

  // Access merchant_id directly from details if isMerchantTaskPage is true
  const merchantId = isMerchantTaskPage ? details.id : null;
  console.log(merchantId);

  // useEffect(() => {
  //   // Fetch org notes whenever noteAdded changes
  //   dispatch({
  //     type: "FETCH_ORG_NOTES",
  //     payload: paramsObject.id,
  //   });

  //   // Reset noteAdded after fetching data
  //   setNoteAdded(false);
  // }, [dispatch, paramsObject.id, noteAdded]);

  useEffect(() => {
    // Define the action type based on isMerchantTaskPage
    const fetchNotesActionType = !isMerchantTaskPage
      ? "FETCH_ORG_NOTES"
      : "FETCH_MERCHANT_NOTES";

    // Fetch notes based on the determined action type
    dispatch({
      type: fetchNotesActionType,
      payload: { id: paramsObject.id, auth: auth },
    });

    // Reset noteAdded after fetching data
    setNoteAdded(false);
  }, [paramsObject.id, noteAdded, isMerchantTaskPage]); // Deleted dispatch from dependencies

  const handleSave = () => {
    // Format the date as "mm/dd/yyyy"
    const formattedDate = noteDate.toISOString().split("T")[0];

    const sendNote = {
      organization_id: isMerchantTaskPage ? null : orgId,
      merchant_id: isMerchantTaskPage ? orgId : null,
      note_date: formattedDate,
      note_content: inputValue,
    };

    // const saveCall = () => {
    //   dispatch({ type: "ADD_ORG_NOTES", payload: sendNote });
    //   setNoteAdded(true);
    // };

    const saveCall = () => {
      const actionType = isMerchantTaskPage
        ? "ADD_MERCHANT_NOTES"
        : "ADD_ORG_NOTES";
      dispatch({
        type: actionType,
        payload: { sendNote: sendNote, auth: auth },
      });
      console.log(sendNote);
      setNoteAdded(true);
    };
    saveCall();

    // Sweet Alert
    showSaveSweetAlert({ label: "Note Added" });

    setInputValue("");
  };

  const showDeleteConfirmation = (note, entityId) => {
    // Sweet Alert
    showDeleteSweetAlert(() => {
      // If the user confirms, call the handleDelete function
      handleDelete(note, entityId);
    }, "delete");
  };

  const handleDelete = (note, entityId) => {
    console.log(note);
    console.log(Number(entityId));

    // Assuming you're using Redux for state management
    const actionType = isMerchantTaskPage
      ? "DELETE_MERCHANT_NOTE"
      : "DELETE_ORG_NOTE";

    dispatch({
      type: actionType,
      payload: {
        deletedNote: {
          id: note.id,
          entity_id: Number(entityId),
          note_date: note.note_date,
          note_content: note.note_content,
          is_deleted: true,
        },
        auth: auth,
      },
    });

    // Call the function to show the confirmation modal
    showDeleteConfirmation(note, entityId);
  };

  return (
    <div className={`details-container ${isSmallScreen ? "small-screen" : ""}`}>
      <Card
        elevation={3}
        className={`notes-card ${caseType === 1 ? "notes-card-task-view" : ""}`}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{ textAlign: "center", mb: 1, fontWeight: "bold" }}
          >
            Notes
          </Typography>

          <div
            className={`orgNotes-container ${
              caseType === 1
                ? "orgNotes-container-task-view"
                : caseType === 2
                ? "additional-style-2"
                : ""
            }`}
          >
            <div style={{ height: "40vh" }}>
              {isNotesLoading && (
                <LoadingSpinner
                  text="Loading..."
                  finalText="Oops! ...unexpected error. Please refresh the page"
                  size={25}
                />
              )}
              {!isNotesLoading && notes.length === 0 && (
                <div
                  style={{
                    minHeight: "25vh",
                    backgroundColor: disabledColor.color,
                    padding: "20%",
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    Notes Empty
                  </Typography>
                </div>
              )}
              {!isNotesLoading &&
                notes
                  .filter((note) => !note.is_deleted) // Filter out deleted notes
                  .map((note, i) => (
                    <div className="note-main-container" key={i}>
                      <Typography sx={{ mt: 1 }} variant="caption">
                        {formatDate(note.note_date)}
                      </Typography>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <li style={{ marginLeft: "10%" }}>
                          {note.note_content &&
                            note.note_content
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                        </li>
                        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                        {/* ~~~~~~ Delete button ~~~~~ */}
                        <Tooltip title="Delete This Note">
                          <Button
                            className="notes-delete-btn"
                            onClick={() => {
                              if (isMerchantTaskPage) {
                                console.log(
                                  "Merchant Task Page - Note ID:",
                                  note.id,
                                  "Merchant ID:",
                                  note.merchant_id
                                );
                                showDeleteConfirmation(note, note.merchant_id);
                              } else {
                                console.log(
                                  "Organization Task Page - Note ID:",
                                  note.id,
                                  "Organization ID:",
                                  note.organization_id
                                );
                                showDeleteConfirmation(
                                  note,
                                  note.organization_id
                                );
                              }
                            }}
                          >
                            <DeleteIcon style={{ fontSize: "20px" }} />
                          </Button>
                        </Tooltip>
                      </div>
                      <br />
                      <hr style={hrStyle} />
                    </div>
                  ))}
            </div>
          </div>
          <div>
            <TextField
              label="Add a note..."
              value={inputValue}
              variant="standard"
              onChange={(e) => setInputValue(e.target.value)}
              multiline
              fullWidth
              sx={{ mt: 1 }}
            />
            {inputValue && (
              <Button
                // variant="contained"
                color="primary"
                onClick={handleSave}
                // style={{ flexGrow: 1 }}
                style={{ marginTop: "10px" }}
                fullWidth
              >
                Add
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
