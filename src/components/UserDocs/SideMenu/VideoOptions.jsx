import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import { IndentedListItemText } from "./GetStartedOptions";

export default function VideoOptions({ isVideoTutorialsOpen }) {
  return (
    <>
      <Collapse in={isVideoTutorialsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton>
            <IndentedListItemText primary="Video 1" />
          </ListItemButton>
          <ListItemButton>
            <IndentedListItemText primary="Video 2" />
          </ListItemButton>
          <ListItemButton>
            <IndentedListItemText primary="Video 3" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}
