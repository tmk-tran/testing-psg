import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";

export const IndentedListItemText = (props) => {
  return <ListItemText {...props} sx={{ ml: 2 }} />;
};

export default function GetStartedOptions({ isGettingStartedOpen, setSelectedContent }) {
  return (
    <>
      <Collapse in={isGettingStartedOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton onClick={() => setSelectedContent("Login")}>
            <IndentedListItemText primary="Login" />
          </ListItemButton>
          <ListItemButton onClick={() => setSelectedContent("Roles")}>
            <IndentedListItemText primary="Roles" />
          </ListItemButton>
          <ListItemButton onClick={() => setSelectedContent("Navigation")}>
            <IndentedListItemText primary="Navigation" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}
