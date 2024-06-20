import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { IconButton, Tooltip } from "@mui/material";
import { errorColor } from "../Utils/colors";

const deletePdfSx = {
  color: errorColor.color,
};
export default function DeletePdfIcon({ size, deleteTitle, onDelete, fileId }) {
  const handleDelete = () => {
    onDelete(fileId);
  };

  return (
    <Tooltip title={deleteTitle}>
      <IconButton sx={{ fontSize: size }} onClick={handleDelete}>
        <DeleteForeverIcon sx={{ ...deletePdfSx, fontSize: size }} />
      </IconButton>
    </Tooltip>
  );
}
