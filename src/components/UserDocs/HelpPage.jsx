import React, { useState } from "react";
import { Box, createTheme, ThemeProvider } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { primaryColor } from "../Utils/colors";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import SideMenu from "./SideMenu/SideMenu";
import Introduction from "./Content/Introduction";
import LoginHelpContent from "./Content/LoginHelp";
import RolesHelpContent from "./Content/RolesHelp";
import NavigationHelpContent from "./Content/NavigationHelp";

const HelpPage = () => {
  const [selectedContent, setSelectedContent] = useState("Introduction");

  const renderContent = () => {
    switch (selectedContent) {
      case "Introduction":
        return <Introduction />;
      case "Login":
        return <LoginHelpContent />;
      case "Roles":
        return <RolesHelpContent />;
      case "Navigation":
        return <NavigationHelpContent />;
      default:
        return <Introduction />;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Table of Contents */}
      <SideMenu setSelectedContent={setSelectedContent} />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          padding: 2,
          // backgroundColor: primaryColor.color,
          backgroundColor: "#001D5D",
          borderRadius: 3,
          overflowY: 'auto', // Enable vertical scrolling for content area
        }}
      >
        {/* Content Here */}
        <Box sx={{ ml: 5, width: "65rem" }}>{renderContent()}</Box>
      </Box>
    </Box>
  );
};

export default HelpPage;
