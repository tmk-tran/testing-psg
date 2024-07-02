import { ListItemButton, ListItemText } from "@mui/material";

export default function MuiListItemButton({
  text,
  onClick,
  state,
  icon1,
  icon2,
}) {
  return (
    <ListItemButton onClick={onClick}>
      <ListItemText primary={text} />
      {state ? icon1 : icon2}
    </ListItemButton>
  );
}
