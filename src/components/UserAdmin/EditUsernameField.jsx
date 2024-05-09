import { Box, TextField } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// ~~~~~~~~~ Hooks ~~~~~~~~~ //
import { flexRowSpace, flexColumnSpace } from "../Utils/pageStyles";
import { errorColor, successColor } from "../Utils/colors";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import ActionButton from "../OrgSellers/ActionButton";

export default function EditUsernameField({
  newUserName,
  setNewUserName,
  resetEditUser,
  handleEditUser,
}) {
  return (
    <Box sx={flexRowSpace}>
      <TextField
        label="New Username"
        variant="outlined"
        fullWidth
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-input": {
            padding: "9px", // Adjust the padding to match the height of the input
          },
          "& .MuiInputLabel-root": {
            transform: "translate(10px, 10px) scale(1)", // Adjust the label position if needed
          },
          "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
            transform: "translate(14px, -6px) scale(0.75)", // Adjust the label position if needed
          },
          mr: 2,
        }}
      />
      <Box sx={{ ...flexColumnSpace, gap: 0.5 }}>
        <ActionButton
          title="Cancel"
          Icon={CancelIcon}
          iconSx={{ color: errorColor.color, fontSize: 22 }}
          onClick={resetEditUser}
        />
        <ActionButton
          title="Save"
          Icon={CheckCircleIcon}
          iconSx={{ color: successColor.color, fontSize: 26 }}
          onClick={handleEditUser}
        />
      </Box>
    </Box>
  );
}
