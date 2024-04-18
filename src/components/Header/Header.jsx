import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
// ~~~~~~~~~~ Style ~~~~~~~~~~ //
import "./Header.css";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { border } from "../Utils/colors";
import { historyHook } from "../../hooks/useHistory";
import { flexCenter } from "../Utils/pageStyles";
import { Region } from "../../hooks/reduxStore";
// ~~~~~~~~~~ Component ~~~~~~~~~~ //
import AccountMenu from "../AccountMenu/AccountMenu";
import NavLinks from "../NavLinks/NavLinks";
import RegionText from "./RegionText";
import RegionSelect from "./RegionSelect";

export default function Header({ user }) {
  console.log(user);
  const history = historyHook();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const regions = Region() || [];
  console.log(regions);

  return (
    <>
      <Box
        sx={{
          height: isMobile ? null : "88px",
          width: isMobile ? "100%" : null,
          backgroundColor: "#273B91",
          position: "relative",
        }}
      >
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ Logo ~~~~~~~~~~ */}
        <Box
          sx={{
            height: isMobile ? null : "86px",
            width: isMobile ? null : "70vw",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            // position: "relative",
          }}
        >
          <img
            className="main-logo"
            src="../images/main-logo.jpg"
            alt="Preferred Saving Guide logo in colors blue and gold"
            onClick={() => history.push("/home")}
            style={{ cursor: "pointer" }}
          />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ Region Text ~~~~~~~~~~ */}
          {user.id ? (
            // <RegionText
            //   isMobile={isMobile}
            //   sx={flexCenter}
            //   color="ghostwhite"
            //   location="Fargo"
            // />
            <Box sx={{ ...flexCenter, width: isMobile ? 100 : 190 }}>
            <RegionSelect isMobile={isMobile} regions={regions} />
            </Box>
          ) : null}
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~ Menu ~~~~~~~~~~ */}
            {/* If a user is logged in, show these links */}
            <Box>{user.id && <AccountMenu isMobile={isMobile} />}</Box>
          </Box>
        </Box>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ Icon ~~~~~~~~~~ */}
        <Box sx={{ position: "absolute", right: "10%", top: "3%" }}>
          {/* <ShoppingCartIcon
            sx={{ color: "ghostwhite", cursor: "pointer" }}
            onClick={() => history.push("/checkout")}
          /> */}
        </Box>
      </Box>
      <Box className="NavLinks-container">
        <NavLinks />
      </Box>
    </>
  );
}
