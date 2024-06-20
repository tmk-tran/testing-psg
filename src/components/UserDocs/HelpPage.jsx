import React from "react";
import { Box, Typography } from "@mui/material";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import SideMenu from "./SideMenu";
import GettingStarted from "./GettingStarted";

const HelpPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Table of Contents */}
      <SideMenu />

      {/* Main Content */}
      <Box sx={{ flex: 1, padding: 2 }}>
        {/* Content Here */}
        <GettingStarted />
      </Box>
    </Box>
  );
};

export default HelpPage;
