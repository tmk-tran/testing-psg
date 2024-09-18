import React, { useState } from "react";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import { Document, Page, pdfjs } from "react-pdf";
import { flexCenter } from "../Utils/pageStyles";

const style = {
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfModal = ({ isMobile, pdf, isOpen, onClose }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Modal open={isOpen} onClose={onClose} sx={flexCenter}>
      <Box
        sx={{
          ...style,
          ...(isMobile ? { width: 350 } : { width: 600 }),
        }}
      >
        {pdf && (
          <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                style={{ display: "block", width: "100%" }}
                width={isMobile ? 350 : undefined}
              />
            ))}
          </Document>
        )}
      </Box>
    </Modal>
  );
};

export default PdfModal;
