import React, { useEffect, useRef } from "react";
import { IconButton, Button } from "@mui/material";
import useFileInput from "./useFileInput";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function UploadFileButton({ title, onFileSelect }) {
  const { selectedFile, addedFileName, handleFileChange } = useFileInput();

  const fileInputRef = useRef(null); // Add useRef here

  const handleFileUploadClick = () => {
    // Trigger the file input click event to open the file selection screen
    fileInputRef.current.click();
  };

  // Call the onFileSelect function with the selected file when it changes
  useEffect(() => {
    if (selectedFile) {
      onFileSelect(selectedFile, addedFileName);
    }
  }, [selectedFile, onFileSelect]);

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Button
        variant="outlined"
        color="primary"
        onClick={handleFileUploadClick}
        title={title}
        fullWidth
      >
        <UploadFileIcon sx={{ mr: 0.5 }} />
        New Pdf
      </Button>
    </>
  );
}
