import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
// ~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { centeredStyle } from "../Utils/pageStyles";

export default function LoadingSpinner({ text, finalText }) {
  const [displayedText, setDisplayedText] = useState(text);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedText(finalText);
    }, 6000); // Change text after 6 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [finalText]);

  return (
    <Box sx={centeredStyle}>
      <CircularProgress />
      {displayedText && <Typography variant="body2">{displayedText}</Typography>}
    </Box>
  );
}
