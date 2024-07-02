import React, { useState } from "react";
import { Box, List } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import MuiListItemButton from "../../ListItem/ListItemButton";
import GetStartedOptions from "./GetStartedOptions";
import TasksOptions from "./TasksOptions";
import VideoOptions from "./VideoOptions";
import CouponsOptions from "./CouponsOptions";
import { primaryColor } from "../../Utils/colors";

const iconColor = {
  color: primaryColor.color,
  "&:hover": {
    color: "#325CAB",
    transition: "transform 0.2s",
    cursor: "pointer",
  },
};

const menuItems = [
  {
    text: "Introduction",
    component: null,
    stateKey: null,
    onClick: (setSelectedContent) => () => setSelectedContent("Introduction"),
  },
  {
    text: "Getting Started",
    component: GetStartedOptions,
    stateKey: "isGettingStartedOpen",
  },
  { text: "Organizations", stateKey: "isOrgMenuOpen" },
  { text: "Merchants", stateKey: "isMerchantMenuOpen" },
  { text: "Sellers", stateKey: "isSellersMenuOpen" },
  { text: "Coupons", component: CouponsOptions, stateKey: "isCouponsMenuOpen" },
  { text: "Tasks", component: TasksOptions, stateKey: "isTasksMenuOpen" },
  {
    text: "Video Tutorials",
    component: VideoOptions,
    stateKey: "isVideoTutorialsOpen",
  },
  { text: "Troubleshooting", component: null, stateKey: null },
];

export default function SideMenu({ setSelectedContent }) {
  const [menuState, setMenuState] = useState({
    isVideoTutorialsOpen: false,
    isGettingStartedOpen: false,
    isOrgMenuOpen: false,
    isMerchantMenuOpen: false,
    isSellersMenuOpen: false,
    isCouponsMenuOpen: false,
    isTasksMenuOpen: false,
  });

  const handleToggle = (stateKey) => {
    setMenuState((prevState) => ({
      ...prevState,
      [stateKey]: !prevState[stateKey],
    }));
  };

  return (
    <Box sx={{ minWidth: 200, padding: 2 }}>
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.text}>
            <MuiListItemButton
              text={item.text}
              onClick={
                item.stateKey
                  ? () => handleToggle(item.stateKey)
                  : item.onClick
                  ? item.onClick(setSelectedContent)
                  : undefined
              }
              state={item.stateKey ? menuState[item.stateKey] : undefined}
              icon1={
                item.stateKey ? <KeyboardArrowDown sx={iconColor} /> : undefined
              }
              icon2={
                item.stateKey ? (
                  <KeyboardArrowRight sx={iconColor} />
                ) : undefined
              }
            />
            {item.component &&
              item.stateKey &&
              menuState[item.stateKey] &&
              React.createElement(item.component, {
                [item.stateKey]: menuState[item.stateKey],
                setSelectedContent,
              })}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}
