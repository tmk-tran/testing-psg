import { Box, Typography } from "@mui/material";
// ~~~~~~~~~~ Utils ~~~~~~~~~~
import { flexCenter } from "../Utils/pageStyles";
import { primaryColor } from "../Utils/colors";
// ~~~~~~~~~~ Hook ~~~~~~~~~~ //
import { useFilePreview } from "../../hooks/useFilePreview";
// ~~~~~~~~~~ Components ~~~~~~~~~ //
import DeletePdfIcon from "./DeletePdfIcon";
import JpgThumbnail from "../JpgThumbnail/JpgThumbnail";
import PageViewButton from "./PageViewButton";
import PdfThumbnail from "../PdfThumbnail/PdfThumbnail";

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
  handleDeleteFile,
}) {
  const { frontSrc, backSrc, frontType, backType } = useFilePreview(directFile);

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
            {showFrontViewFiles &&
            (directFile.frontViewBlob || directFile.frontViewUrl) ? (
              <>
                {caseType !== "preview" && (
                  <Box sx={boxStyle}>
                    <>
                      <DeletePdfIcon
                        size={25}
                        deleteTitle="Delete PDF"
                        onDelete={handleDeleteFile}
                        fileId={directFile.id}
                      />
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
                  {frontType.isPdf ? (
                    <PdfThumbnail
                      pdf={directFile.frontViewBlob ?? directFile.frontViewUrl} // can update to use the useFilePreview hook, similar to ThumbView.jsx
                      style={thumbnailSize}
                    />
                  ) : frontType.isJpg ? (
                    <JpgThumbnail imageUrl={frontSrc} />
                  ) : null}
                </div>
              </>
            ) : null}
            {showBackViewFiles &&
            (directFile.backViewBlob || directFile.backViewUrl) ? (
              <>
                {caseType !== "preview" && (
                  <Box sx={boxStyle}>
                    <>
                      <DeletePdfIcon
                        size={25}
                        deleteTitle="Delete PDF"
                        onDelete={handleDeleteFile}
                        fileId={directFile.id}
                      />
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
                  {backType.isPdf ? (
                    <PdfThumbnail
                      pdf={directFile.backViewBlob ?? directFile.backViewUrl}
                      style={thumbnailSize}
                    />
                  ) : backType.isJpg ? (
                    <JpgThumbnail imageUrl={backSrc} />
                  ) : null}
                </div>
              </>
            ) : null}
            {((showFrontViewFiles &&
              !directFile.frontViewBlob &&
              !directFile.frontViewUrl) ||
              (showBackViewFiles &&
                !directFile.backViewBlob &&
                !directFile.backViewUrl)) && (
              <Box>
                <Box sx={{ height: 25 }}></Box>
                <Box sx={{ ...thumbnailSize, ...flexCenter, margin: "0 auto" }}>
                  <Typography variant="caption">No file available</Typography>
                </Box>
              </Box>
            )}
          </>
        )}
      </>
    </div>
  );
}
