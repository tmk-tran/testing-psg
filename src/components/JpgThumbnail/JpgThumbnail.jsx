import { useState } from "react";
import { Box, Dialog, DialogContent } from "@mui/material";
import { flexCenter } from "../Utils/pageStyles";

const JpgThumbnail = ({ imageUrl, isMobile }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal open/close

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen); // Toggles the modal open/close
  };

  return (
    <Box sx={flexCenter}>
      <Box
        sx={{ width: "12.5rem", height: "9.375rem", cursor: "zoom-in" }}
        onClick={handleModalToggle}
      >
        <img
          src={imageUrl}
          alt="thumbnail"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain", // maintain aspect ratio without overflow
            display: "block", // remove inline gaps
          }} // Make the image responsive
        />
      </Box>
      {/* Modal for Enlarged Image */}
      <Dialog
        open={isModalOpen} // Control modal open state
        onClose={handleModalToggle} // Close modal when clicked outside
        maxWidth="md" // Set max width for modal
        sx={{
          margin: isMobile ? {} : "0 auto",
        }} // To match the pdf modal
      >
        <DialogContent>
          <Box
            component="img"
            src={imageUrl}
            alt="enlarged-thumbnail"
            sx={{
              width: "100%", // Full width of the modal
              height: "auto", // Maintain aspect ratio
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default JpgThumbnail;
