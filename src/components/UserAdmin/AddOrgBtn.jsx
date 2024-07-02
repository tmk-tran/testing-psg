import { IconButton, Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function AddOrgBtn({ title, sx, disabled, onClick }) {
  return (
    <>
      {!disabled && (
        <Tooltip title={title}>
          <IconButton disabled={disabled} onClick={onClick}>
            <AddCircleIcon sx={sx} />
          </IconButton>
        </Tooltip>
      )}
      {disabled && (
        <IconButton disabled={disabled} onClick={onClick}>
          <AddCircleIcon sx={sx} />
        </IconButton>
      )}
    </>
  );
}
