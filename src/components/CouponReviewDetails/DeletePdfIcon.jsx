import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { IconButton, Tooltip } from "@mui/material";
import { errorColor } from "../Utils/colors";

const deletePdfSx = {
  color: errorColor.color,
};
export default function DeletePdfIcon({ size, deleteTitle, onDelete, fileId }) {
  const handleDelete = () => {
    // Returns an id to the parent component
    //  Initially set up for pdf display in coupons, but using in
    //  CouponReviewCard, for removing coupons using a soft delete
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
