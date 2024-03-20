import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import {
  Typography,
  ThemeProvider,
  createTheme,
  Link as MuiLink,
} from "@mui/material";
import "./NavLinks.css";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { User } from "../../hooks/reduxStore";

// Custom theme for MUI component
const theme = createTheme({
  typography: {
    fontSize: 15,
    fontFamily: "Telugu Sangam MN",
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#273b91", // Customize link color
          // Add other styles for MuiLink here
          textTransform: "uppercase",
          fontFamily: "Telugu Sangam MN",
        },
      },
    },
  },
});

export default function NavLinks() {
  const location = useLocation();
  const user = User();
  console.log(user);

  // Hide NavLinks component on the checkout page
  if (location.pathname === "/checkout") {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="NavLinks-container">
        {/* If no user is logged in or user is an org admin, show these links */}
        {!user.id || user.org_admin || user.graphic_designer ? (
          <>
            {(!user.graphic_designer || !user.id) && (
              <Typography
                sx={{
                  textAlign: !user.id ? "center" : "inherit",
                  flexGrow: !user.id ? 1 : "inherit",
                }}
              >
                <MuiLink
                  component={Link}
                  className="main-navlink"
                  to="/login"
                  underline="hover"
                >
                  Login / Register
                </MuiLink>
              </Typography>
            )}
            {/* Add the /home link for org admins */}
            {user.org_admin && (
              <Typography>
                <MuiLink
                  component={Link}
                  className="main-navlink"
                  to="/home"
                  underline="hover"
                >
                  Organizations
                </MuiLink>
              </Typography>
            )}
            {/* Links for graphic designer */}
            {user.graphic_designer && (
              <>
                <Typography>
                  <MuiLink
                    component={Link}
                    className="main-navlink"
                    to="/home"
                    underline="hover"
                  >
                    Merchants
                  </MuiLink>
                </Typography>

                <Typography>
                  <MuiLink
                    component={Link}
                    className="main-navlink"
                    to="/coupon"
                    underline="hover"
                  >
                    Coupons
                  </MuiLink>
                </Typography>

                <Typography>
                  <MuiLink
                    component={Link}
                    className="main-navlink"
                    to="/tasks"
                    underline="hover"
                  >
                    Tasks
                  </MuiLink>
                </Typography>
              </>
            )}
          </>
        ) : (
          // If a user is_admin status, show these links
          user.is_admin && (
            <>
              <Typography>
                <MuiLink
                  component={Link}
                  className="main-navlink"
                  to="/home"
                  underline="hover"
                >
                  Home
                </MuiLink>
              </Typography>

              <Typography>
                <MuiLink
                  component={Link}
                  className="main-navlink"
                  to="/newFundraiser"
                  underline="hover"
                >
                  New Fundraiser
                </MuiLink>
              </Typography>

              <Typography>
                <MuiLink
                  component={Link}
                  className="main-navlink"
                  to="/archivedOrganizations"
                  underline="hover"
                >
                  Archived Organizations
                </MuiLink>
              </Typography>

              <Typography>
                <MuiLink
                  component={Link}
                  className="main-navlink"
                  to="/coupon"
                  underline="hover"
                >
                  Coupons
                </MuiLink>
              </Typography>

              <Typography>
                <MuiLink
                  component={Link}
                  className="main-navlink"
                  to="/tasks"
                  underline="hover"
                >
                  Tasks
                </MuiLink>
              </Typography>

              <Typography>
                <MuiLink
                  component={Link}
                  className="main-navlink"
                  to="/transactions"
                  underline="hover"
                >
                  Transactions
                </MuiLink>
              </Typography>

              {/* <Typography>
              <MuiLink
                component={Link}
                className="main-navlink"
                to="/order"
                underline="hover"
              >
                Order
              </MuiLink>
            </Typography> */}
            </>
          )
        )}
      </div>
    </ThemeProvider>
  );
}
