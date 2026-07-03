import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import LinksSocial from "../LinksSocial/LinksSocial";
import "./Footer.css";

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#273B91",
        color: "white",
        textAlign: "center",
        pt: 1.5,
        pb: 1,
      }}
    >
      <div className="footer-container">
        <div>
          <Typography
            sx={{
              fontSize: "clamp(0.75rem, 2.5vw, 1rem)", // scales down on small phones
              fontWeight: 500, // keeps it readable
              lineHeight: isMobile ? 1.3 : "normal", // prevents cramped text
              px: 1, // prevents edge crowding
            }}
          >
            © 2023 THE PREFERRED SAVINGS GUIDE
          </Typography>
        </div>
        <div className="center-icon-container">
          <div className="center-icon">
            <LinksSocial colors={["white", "white", "white", "white"]} />
          </div>
        </div>
        <Typography
          sx={{
            fontSize: "clamp(0.75rem, 2.5vw, 0.9rem)", // slightly smaller than copyright
            fontWeight: 500,
            lineHeight: isMobile ? 1.3 : "normal",
          }}
        >
          ALL SALES ARE FINAL
        </Typography>
      </div>
    </Box>
  );
}
