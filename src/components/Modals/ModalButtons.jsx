import { Button } from "@mui/material";
import { saveBtnWidth } from "../Utils/helpers";
import { flexRowSpace } from "../Utils/pageStyles";

export default function ModalButtons({
  label,
  editedAccount,
  onSave,
  onCancel,
  sx,
  width,
  caseType,
}) {
  const buttonSx = {
    width: width === "50%" ? "50%" : "auto",
    ...sx,
  };

  const handleSave = () => {
    onSave(editedAccount);
  };

  return (
    <div style={flexRowSpace}>
      <Button
        className="modal-cancel-btn"
        onClick={onCancel}
        sx={{ width: "50%", ...sx }}
      >
        Cancel
      </Button>
      <Button
        onClick={handleSave}
        variant="contained"
        color={caseType === "moneyUpdate" ? "primary" : "secondary"}
        // sx={saveBtnWidth}
        sx={width === "50%" ? { ...saveBtnWidth, ...buttonSx } : saveBtnWidth}
      >
        {label}
      </Button>
    </div>
  );
}
