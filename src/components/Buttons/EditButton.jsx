import EditNoteIcon from "@mui/icons-material/EditNote";
import { Button } from "@mui/material";

export default function EditButton({ onClick }) {
  return (
    <Button>
      <EditNoteIcon onClick={onClick} />
    </Button>
  );
}
