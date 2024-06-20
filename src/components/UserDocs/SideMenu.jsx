import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";

export default function SideMenu() {
  // Table of Contents
  return (
    <Box sx={{ minWidth: 200, padding: 2 }}>
      <Typography variant="h6">Table of Contents</Typography>
      <List>
        <ListItem button>
          <ListItemText primary="Getting Started" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="FAQs" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Troubleshooting" />
        </ListItem>
      </List>
    </Box>
  );
}
