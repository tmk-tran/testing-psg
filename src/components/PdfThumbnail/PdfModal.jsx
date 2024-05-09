import React, { useState } from "react";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import { Document, Page, pdfjs } from "react-pdf";

const style = {
  //   position: "absolute",
  //   top: "50%",
  //   left: "50%",
  //   transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  margin: "0 auto",
  //   p: 4,
};

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfModal = ({ isMobile, pdf, isOpen, onClose }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          ...style,
          ...(isMobile ? { margin: 0 } : {}),
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
