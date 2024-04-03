// ~~~~~~~~~~ Icons ~~~~~~~~~~ //
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { flexCenter } from "../Utils/pageStyles";
import { secondaryColor } from "../Utils/colors";

export default function ErrorOutline() {
  return (
    <div style={{ height: "40%", ...flexCenter }}>
      <div style={flexCenter}>
        <ErrorOutlineIcon sx={{ fontSize: "100px", color: secondaryColor }} />
      </div>
    </div>
  );
}
