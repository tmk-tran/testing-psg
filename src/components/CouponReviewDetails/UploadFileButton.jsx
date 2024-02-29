import React, { useEffect, useRef } from "react";
import { IconButton } from "@mui/material";
import useFileInput from "./useFileInput";
import AttachFileIcon from "@mui/icons-material/AttachFile";

export default function UploadFileButton({ title, onFileSelect }) {
  const { selectedFile, addedFileName, handleFileChange } = useFileInput();

  const fileInputRef = useRef(null); // Add useRef here
  console.log(fileInputRef);

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
      <IconButton color="primary" onClick={handleFileUploadClick} title={title}>
        <AttachFileIcon />
      </IconButton>
    </>
  );
}