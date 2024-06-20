import { Box, Button } from "@mui/material";

const boxStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 1,
};

export default function SearchButtons({
  handleClose,
  fetchByName,
  searchByRefId,
  fetchByRefId,
}) {
  return (
    <Box sx={boxStyle}>
      <Button onClick={handleClose}>Cancel</Button>
      <Button
        variant="contained"
        onClick={!searchByRefId ? fetchByName : fetchByRefId}
      >
        Search
      </Button>
    </Box>
  );
}
