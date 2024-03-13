import React, { useState, useRef } from "react";
import { TextField, Button, IconButton, Paper } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { dispatchHook } from "../../hooks/useDispatch";
import { User } from "../../hooks/reduxStore";
import { border } from "../Utils/colors";
import FilePreview from "./FilePreview";
import { capitalizeFirstWord } from "../Utils/helpers";
import { useSelector } from "react-redux";

export default function CommentInput({
  merchantId,
  taskId,
  onSubmit,
  onChange,
  files,
  onUploadFile,
}) {
  // console.log(merchantId);
  // console.log(taskId);
  // console.log(files);
  const [comment, setComment] = useState("");
  const [commentAdded, setCommentAdded] = useState(false);
  const [addedFileName, setAddedFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  // console.log(selectedFile);
  // console.log(addedFileName);
  // console.log(commentAdded);
  // console.log(comment);
  const user = User() || [];
  console.log(user.username);
  const currentUsername = user.username;
  console.log(currentUsername);

  const fileInputRef = useRef(null); // Add useRef here
  console.log(fileInputRef);

  const dispatch = dispatchHook();
  const auth = useSelector((store) => store.auth)

  const newComment = {
    merchant_id: merchantId,
    comment_content: comment,
    user: currentUsername,
    task_id: taskId,
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected File:", file);
    console.log(file.name);
    setAddedFileName(file.name);

    setSelectedFile(file);
  };

  const handleFileUploadClick = () => {
    // Trigger the file input click event to open the file selection screen
    fileInputRef.current.click();
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Check if the selected file is a PDF
      if (selectedFile.type === "application/pdf") {
        // Dispatch the action for uploading PDF
        dispatch({ type: "UPLOAD_PDF_REQUEST", payload: { selectedFile } });
        setSelectedFile(null);
        onUploadFile();
      } else {
        // Alert the user if the selected file is not a PDF
        alert("Please select a PDF file");
      }
    } else {
      // Alert the user if no file is selected
      alert("No file selected");
    }
  };

  const handleSubmit = () => {
    // Handle comment submission logic
    console.log("Comment submitted:", newComment);
    dispatch({ type: "ADD_MERCHANT_COMMENT", payload: {newComment: newComment, auth: auth} });
    setCommentAdded(true);
    setComment("");
    onSubmit();
    onChange();
  };

  return (
    <Paper
      elevation={3}
      style={{
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        height: "fit-content",
      }}
    >

      <TextField
        label="Type your comment..."
        multiline
        maxRows={4}
        variant="outlined"
        value={comment}
        onChange={(e) => setComment(capitalizeFirstWord(e.target.value))}
        style={{ marginBottom: "10px" }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >

        <div style={{ flexGrow: 1 }}></div>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </Paper>
  );
}
