import React from "react";
import { Box, Typography } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { flexCenter } from "../Utils/pageStyles";
import { border, primaryColor } from "../Utils/colors";
// ~~~~~~~~~~ Components ~~~~~~~~~ //
import PdfThumbnail from "../PdfThumbnail/PdfThumbnail";
import DeletePdfIcon from "./DeletePdfIcon";
import PageViewButton from "./PageViewButton";

export const thumbnailSize = {
  height: "150px",
  width: "150px",
};

const boxStyle = {
  display: "flex",
  justifyContent: "center",
  height: 25,
};

const divStyle = {
  marginTop: "auto",
};

const viewButtonSx = {
  color: primaryColor.color,
};

export default function FilePreview({
  showFrontViewFiles,
  showBackViewFiles,
  caseType,
  directFile,
}) {
  const handleButtonClick = (file, type) => {
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

  return (
    <div style={divStyle}>
      <>
        {directFile && (
          <>
            {showFrontViewFiles && directFile.frontViewBlob !== null ? (
              <>
                {caseType !== "preview" && (
                  <Box sx={boxStyle}>
                    <>
                      <DeletePdfIcon size={25} deleteTitle="Delete PDF" />
                      <Box sx={{ flexGrow: 1 }}></Box>
                      {/* ~~~~~ View PDF ~~~~~ */}
                      <PageViewButton
                        viewButtonSx={viewButtonSx}
                        handleButtonClick={handleButtonClick}
                        view="frontView"
                        directFile={directFile}
                        viewTitle="View Front"
                      />
                    </>
                  </Box>
                )}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <PdfThumbnail
                    pdf={directFile.frontViewBlob}
                    style={thumbnailSize}
                  />
                </div>
              </>
            ) : null}
            {showBackViewFiles && directFile.backViewBlob !== null ? (
              <>
                {caseType !== "preview" && (
                  <Box sx={boxStyle}>
                    <>
                      <DeletePdfIcon size={25} deleteTitle="Delete PDF" />
                      <Box sx={{ flexGrow: 1 }}></Box>
                      {/* ~~~~~ View PDF ~~~~~ */}
                      <PageViewButton
                        viewButtonSx={viewButtonSx}
                        handleButtonClick={handleButtonClick}
                        view="backView"
                        directFile={directFile}
                        viewTitle="View Back"
                      />
                    </>
                  </Box>
                )}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <PdfThumbnail
                    pdf={directFile.backViewBlob}
                    style={thumbnailSize}
                  />
                </div>
              </>
            ) : null}
            {(showFrontViewFiles && directFile.frontViewBlob === null) ||
            (showBackViewFiles && directFile.backViewBlob === null) ? (
              <Box>
                <Box sx={{ height: 25 }}></Box>
                <Box sx={{ ...thumbnailSize, ...flexCenter, margin: "0 auto" }}>
                  <Typography variant="caption">No file available</Typography>
                </Box>
              </Box>
            ) : null}
          </>
        )}
      </>
    </div>
  );
}
