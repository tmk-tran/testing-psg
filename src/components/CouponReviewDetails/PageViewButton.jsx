import { IconButton, Tooltip } from "@mui/material";
import PageviewIcon from "@mui/icons-material/Pageview";

export default function PageViewButton({
  viewButtonSx,
  handleButtonClick,
  view,
  directFile,
  viewTitle,
}) {
  return (
    <Tooltip title={viewTitle}>
      <IconButton
        onClick={() => handleButtonClick(directFile, view)}
        sx={viewButtonSx}
      >
        <PageviewIcon />
      </IconButton>
    </Tooltip>
  );
}
