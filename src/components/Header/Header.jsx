import { Box, Typography } from "@mui/material";
// ~~~~~~~~~~ Style ~~~~~~~~~~ //
import "./Header.css";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { border } from "../Utils/colors";
import { historyHook } from "../../hooks/useHistory";
import { flexCenter } from "../Utils/pageStyles";
// ~~~~~~~~~~ Component ~~~~~~~~~~ //
import AccountMenu from "../AccountMenu/AccountMenu";
import NavLinks from "../NavLinks/NavLinks";
import RegionText from "./RegionText";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Header({ user }) {
  console.log(user);
  const history = historyHook();

  return (
    <>
      <div style={{ height: "88px", backgroundColor: "#273B91" }}>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ Logo ~~~~~~~~~~ */}
        <div
          style={{
            height: "86px",
            width: "70vw",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
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
          <RegionText sx={flexCenter} color="ghostwhite" location="Fargo" />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~ Menu ~~~~~~~~~~ */}
            {/* If a user is logged in, show these links */}
            <div>{user.id && <AccountMenu />}</div>
          </div>
        </div>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ Icon ~~~~~~~~~~ */}
        <div style={{ position: "absolute", right: "10%", top: "3%" }}>
          {/* <ShoppingCartIcon
            sx={{ color: "ghostwhite", cursor: "pointer" }}
            onClick={() => history.push("/checkout")}
          /> */}
        </div>
      </div>
      <div className="NavLinks-container">
        <NavLinks />
      </div>
    </>
  );
}
