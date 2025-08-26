import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
// ~~~~~~~~~ Utils ~~~~~~~~~~ //
import { centeredStyle } from "../Utils/pageStyles";

export default function LoadingSpinner({
  text,
  waitingText,
  finalText,
  timeout,
  size,
}) {
  const [displayedText, setDisplayedText] = useState(text);

  useEffect(() => {
    if (!timeout) timeout = 6000; // default timeout if not provided

    // halfway point to show waitingText
    const midTimeout = setTimeout(() => {
      if (waitingText) setDisplayedText(waitingText);
    }, timeout / 2);

    // full timeout for finalText
    const finalTimeout = setTimeout(() => {
      setDisplayedText(finalText);
    }, timeout);

    return () => {
      clearTimeout(midTimeout);
      clearTimeout(finalTimeout);
    };
  }, [waitingText, finalText, timeout]);

  return (
    <Box sx={centeredStyle}>
      <CircularProgress size={size} />
      {displayedText && (
        <Typography variant="body2">{displayedText}</Typography>
      )}
    </Box>
  );
}
