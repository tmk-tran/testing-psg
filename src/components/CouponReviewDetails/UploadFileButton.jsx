import { useEffect, useRef } from "react";
import { Button } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import useFileInput from "./useFileInput";

export default function UploadFileButton({ title, onFileSelect }) {
  const { selectedFile, addedFileName, handleFileChange } = useFileInput();

  const fileInputRef = useRef(null); // Add useRef here

  // Call the onFileSelect function with the selected file when it changes
  useEffect(() => {
    if (selectedFile) {
      onFileSelect(selectedFile, addedFileName);
    }
  }, [selectedFile, onFileSelect]);

  const handleFileUploadClick = () => {
    // Trigger the file input click event to open the file selection screen
    fileInputRef.current.click();
  };

  return (
    <>
      <input
        type="file"
        accept="application/pdf,image/jpeg"
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
        New Image
      </Button>
    </>
  );
}
