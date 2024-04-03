import { Box, Button } from "@mui/material";

const boxStyle = {
  display: "flex",
  flexDirection: "row",
  mt: 1,
};

const buttonStyle = {
  minWidth: "auto",
  padding: "4px 8px",
  fontSize: "0.875rem",
};

export default function TaskCardButtons({ onSave, onCancel }) {
  return (
    <Box sx={boxStyle}>
      <Button
        className="modal-cancel-btn"
        onClick={onCancel}
        size="small"
        sx={buttonStyle}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={onSave}
        sx={buttonStyle}
      >
        Save
      </Button>
    </Box>
  );
}
