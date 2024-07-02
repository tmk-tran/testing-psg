import React, { useState } from "react";
import { TextField, Button, InputAdornment } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CheckIcon from "@mui/icons-material/Check";

export default function AddFileButton({ filename, onFileSelect }) {
  const [file, setFile] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    onFileSelect(uploadedFile);
    setIsDisabled(false);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
      <input
        // type="file"
        // accept="image/*"
        type="file"
        accept="application/pdf, image/*"
        style={{ display: "none" }}
        id="file-upload"
        onChange={handleFileChange}
      />
      <TextField
        // disabled
        fullWidth
        value={
          file
            ? file.name
            : !filename || filename === ""
            ? "Please upload a high resolution logo"
            : filename
        }
        sx={{ fontSize: 12, mb: 2 }}
        disabled={isDisabled}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <label htmlFor="file-upload">
                <Button
                  variant="contained"
                  component="span"
                  sx={{ height: "100%" }}
                >
                  <FileUploadIcon />
                  &nbsp;Logo
                </Button>
              </label>
            </InputAdornment>
          ),
          endAdornment: file && (
            <InputAdornment position="end">
              <CheckIcon color="success" />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}
