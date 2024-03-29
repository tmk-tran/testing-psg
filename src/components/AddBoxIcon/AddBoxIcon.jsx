import { Button, Tooltip } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { buttonIconSpacing } from "../Utils/helpers";

export default function AddBox({ title, label, buttonStyle, onClick }) {
  return (
    <Tooltip title={title}>
      <Button variant="contained" sx={{ ...buttonStyle }} onClick={onClick}>
        <AddBoxIcon sx={buttonIconSpacing} />
        {label}
      </Button>
    </Tooltip>
  );
}
