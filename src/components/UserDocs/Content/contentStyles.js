import { styled, List, ListItem } from "@mui/material";

// Screenshot image styles
export const imageSize = {
  width: "30rem",
  height: "auto",
  objectFit: "cover",
  objectPosition: "center",
  borderRadius: 2,
};

export const largeImageSize = {
  width: "40rem",
  height: "auto",
  objectFit: "cover",
  objectPosition: "center",
  borderRadius: 2,
};

export const imageStyle = {
  borderRadius: 2,
  mb: 5,
};

export const imgBoxStyle = {
  mb: 5,
  width: "fit-content",
  height: "fit-content",
  padding: 1,
  borderRadius: 2,
};

// Typography style used in content
export const typographyListColor = {
  color: "ghostwhite",
};

// List Style
export const StyledList = styled(List)({
  paddingLeft: "1.5em", // Adjust to match ul padding
});

export const StyledListItem = styled(ListItem)({
  display: "list-item",
  listStyleType: "disc",
  paddingLeft: "0", // Reset padding added by ListItem
  marginBottom: "0.5em", // Adjust to match li margin
  "&::marker": {
    color: "ghostwhite", // White color for the bullet
  },
});
