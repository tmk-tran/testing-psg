import EditNoteIcon from "@mui/icons-material/EditNote";
import { Button, Tooltip } from "@mui/material";

export default function EditButton({ onClick, title }) {
  return (
    <Tooltip title={title}>
      <Button onClick={onClick}>
        <EditNoteIcon />
      </Button>
    </Tooltip>
  );
}
