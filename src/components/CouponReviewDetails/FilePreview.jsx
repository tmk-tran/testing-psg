import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { dispatchHook } from "../../hooks/useDispatch";
import { flexCenter } from "../Utils/pageStyles";
import { border } from "../Utils/colors";
import PdfThumbnail from "../PdfThumbnail/PdfThumbnail";

export const thumbnailSize = {
  height: "150px",
  width: "150px",
};

const boxStyle = {
  display: "flex",
  justifyContent: "center",
  // position: "relative"
};

const FilePreview = ({
  pdfBlob,
  merchantId,
  showFrontViewFiles,
  showBackViewFiles,
  caseType,
  directFile,
}) => {
  console.log(merchantId);
  console.log(showFrontViewFiles);
  console.log(showBackViewFiles);
  console.log(caseType);
  const dispatch = dispatchHook();
  const [pdf, setPdf] = useState(null);
  console.log(pdfBlob);
  console.log(directFile);
  console.log(pdf);
  const [isUploading, setIsUploading] = useState(false);
  console.log(isUploading);
  const [frontViewUrl, setFrontViewUrl] = useState(null);
  console.log(frontViewUrl);
  const [backViewUrl, setBackViewUrl] = useState(null);
  console.log(backViewUrl);

  const handleButtonClick = (file, type) => {
    console.log(file);
    console.log(type);
    let blob = null;

    switch (type) {
      case "pdf":
        blob = file.pdfBlob;
        break;
      case "frontView":
        blob = file.frontViewBlob;
        break;
      case "backView":
        blob = file.backViewBlob;
        break;
      default:
        break;
    }

    if (blob instanceof Blob) {
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };
  console.log(directFile);

  return (
    <div>
      <>
        {directFile && (
          <>
            {showFrontViewFiles && directFile.frontViewBlob !== null ? (
              <>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <PdfThumbnail
                    pdf={directFile.frontViewBlob}
                    style={thumbnailSize}
                  />
                </div>
                {caseType !== "preview" && (
                  <Box sx={boxStyle}>
                    <Button
                      onClick={() => handleButtonClick(directFile, "frontView")}
                    >
                      View Front
                    </Button>
                  </Box>
                )}
              </>
            ) : null}
            {showBackViewFiles && directFile.backViewBlob !== null ? (
              <>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <PdfThumbnail
                    pdf={directFile.backViewBlob}
                    style={thumbnailSize}
                  />
                </div>
                {caseType !== "preview" && (
                  <Box sx={boxStyle}>
                    <Button
                      onClick={() => handleButtonClick(directFile, "backView")}
                    >
                      View Back
                    </Button>
                  </Box>
                )}
              </>
            ) : null}
            {(showFrontViewFiles && directFile.frontViewBlob === null) ||
            (showBackViewFiles && directFile.backViewBlob === null) ? (
              <Box sx={{ ...thumbnailSize, ...flexCenter }}>
                <Typography variant="caption">No file available</Typography>
              </Box>
            ) : null}
          </>
        )}
      </>
    </div>
  );
};

export default FilePreview;
