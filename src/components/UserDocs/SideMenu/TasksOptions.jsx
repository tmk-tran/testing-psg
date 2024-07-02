import { Collapse, List, ListItemButton } from "@mui/material";
import { IndentedListItemText } from "./GetStartedOptions";

export default function TasksOptions({ isTasksMenuOpen }) {
  return (
    <>
      <Collapse in={isTasksMenuOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton>
            <IndentedListItemText primary="Create a new Task" />
          </ListItemButton>
          <ListItemButton>
            <IndentedListItemText primary="Manage Tasks" />
          </ListItemButton>
          <ListItemButton>
            <IndentedListItemText primary="Item 3" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}
