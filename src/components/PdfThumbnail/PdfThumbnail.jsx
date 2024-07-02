import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { CircularProgress } from "@mui/material";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { flexCenter } from "../Utils/pageStyles";
// ~~~~~~~~~~ Components ~~~~~~~~~ //
import PdfModal from "./PdfModal";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfThumbnail = ({ isMobile, pdf, style, width, caseType }) => {
  const [loading, setLoading] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDocumentLoadSuccess = () => {
    setLoading(false);
  };

  const handleMouseEnter = () => {
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  const handleThumbnailClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {pdf ? (
        <>
          <div
            style={{
              // ...border,
              ...style,
              overflow: "hidden",
              position: "relative",
              ...flexCenter,
              ...(caseType === "consumer"
                ? {
                    transition: "transform 0.3s",
                    // transform: hovering ? "scale(.9)" : "scale(1)",
                    // cursor: "zoom-in",
                    transform: isMobile
                      ? "scale(1)"
                      : hovering
                      ? "scale(.9)"
                      : "scale(1)",
                    cursor: isMobile ? "default" : "zoom-in",
                    // margin: hovering ? "3%" : 0,
                    // padding: hovering ? "5%" : 0,
                    // width: hovering ? "500px" : width ? width : "150px",
                    // maxWidth: 250,
                    // height: hovering ? "200px" : "150px",
                    // maxHeight: 150,
                  }
                : {}),
            }}
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
            onMouseEnter={!isMobile ? handleMouseEnter : undefined}
            onMouseLeave={!isMobile ? handleMouseLeave : undefined}
            onClick={handleThumbnailClick}
          >
            <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={1} width={width ? width : 150} />
            </Document>
            {/* <img src={pdf} alt="Thumbnail" /> */}
            {loading && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "rgba(255, 255, 255, 0.5)",
                }}
              >
                <CircularProgress />
              </div>
            )}
          </div>
          <PdfModal
            isMobile={isMobile}
            pdf={pdf}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </>
      ) : (
        <p>No files available</p>
      )}
    </>
  );
};

export default PdfThumbnail;
