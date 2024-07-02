import { Collapse, List, ListItemButton } from "@mui/material";
import { IndentedListItemText } from "./GetStartedOptions";

export default function CouponsOptions({ isCouponsMenuOpen }) {
  return (
    <>
      <Collapse in={isCouponsMenuOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton>
            <IndentedListItemText primary="Create New" />
          </ListItemButton>
          <ListItemButton>
            <IndentedListItemText primary="Manage Coupons" />
          </ListItemButton>
          <ListItemButton>
            <IndentedListItemText primary="Item 3" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}
