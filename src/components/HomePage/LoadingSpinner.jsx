import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
// ~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { centeredStyle } from "../Utils/pageStyles";

export default function LoadingSpinner({ text, finalText, timeout }) {
  const [displayedText, setDisplayedText] = useState(text);

  useEffect(() => {
    let timer;
    if (timeout) {
      timer = setTimeout(() => {
        setDisplayedText(finalText);
      }, timeout);
    } else {
      timer = setTimeout(() => {
        setDisplayedText(finalText);
      }, 6000); // Default timeout
    }

    return () => clearTimeout(timer);
  }, [finalText, timeout]);

  return (
    <Box sx={centeredStyle}>
      <CircularProgress />
      {displayedText && (
        <Typography variant="body2">{displayedText}</Typography>
      )}
    </Box>
  );
}
