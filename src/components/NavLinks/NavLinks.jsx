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
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#273b91", // Customize link color
          // Add other styles for MuiLink here
          textTransform: "uppercase",
        },
      },
    },
  },
});

export default function NavLinks() {
  const location = useLocation();
  const user = User();

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
            {!user.id && (
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
                  Login
                </MuiLink>
              </Typography>
            )}
            {/* Added the /home link for org admins */}
            {user.org_admin && !user.graphic_designer && (
              <>
                <Typography>
                  <MuiLink
                    component={Link}
                    className="main-navlink"
                    to="/fargo/home"
                    underline="hover"
                  >
                    Organizations
                  </MuiLink>
                </Typography>
                <Typography>
                  <MuiLink
                    component={Link}
                    className="main-navlink"
                    to="/fargo/coupon"
                    underline="hover"
                  >
                    Coupons
                  </MuiLink>
                </Typography>
              </>
            )}
            {/* Links for graphic designer */}
            {/* Current graphic designer is both an org admin and a graphic designer */}
            {/* this condition will need to change if the role is ever switched */}
            {user.graphic_designer && user.org_admin && !user.is_admin && (
              <>
                <Typography>
                  <MuiLink
                    component={Link}
                    className="main-navlink"
                    to="/fargo/home"
                    underline="hover"
                  >
                    Merchants
                  </MuiLink>
                </Typography>

                <Typography>
                  <MuiLink
                    component={Link}
                    className="main-navlink"
                    to="/fargo/coupon"
                    underline="hover"
                  >
                    Coupons
                  </MuiLink>
                </Typography>

                <Typography>
                  <MuiLink
                    component={Link}
                    className="main-navlink"
                    to="/fargo/tasks"
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
                  to="/fargo/home"
                  underline="hover"
                >
                  Home
                </MuiLink>
              </Typography>

              <Typography>
                <MuiLink
                  component={Link}
                  className="main-navlink"
                  to="/fargo/newFundraiser"
                  underline="hover"
                >
                  New Fundraiser
                </MuiLink>
              </Typography>

              <Typography>
                <MuiLink
                  component={Link}
                  className="main-navlink"
                  to="/fargo/archivedOrganizations"
                  underline="hover"
                >
                  Archived Organizations
                </MuiLink>
              </Typography>

              <Typography>
                <MuiLink
                  component={Link}
                  className="main-navlink"
                  to="/fargo/coupon"
                  underline="hover"
                >
                  Coupons
                </MuiLink>
              </Typography>

              <Typography>
                <MuiLink
                  component={Link}
                  className="main-navlink"
                  to="/fargo/tasks"
                  underline="hover"
                >
                  Tasks
                </MuiLink>
              </Typography>

              <Typography>
                <MuiLink
                  component={Link}
                  className="main-navlink"
                  to="/fargo/transactions"
                  underline="hover"
                >
                  Transactions
                </MuiLink>
              </Typography>

              <Typography>
                <MuiLink
                  component={Link}
                  className="main-navlink"
                  to="/fargo/useradmin"
                  underline="hover"
                >
                  Users
                </MuiLink>
              </Typography>
            </>
          )
        )}
        {user.id && (
          <Typography>
            <MuiLink
              component={Link}
              className="main-navlink"
              to="/help"
              underline="hover"
            >
              Help
            </MuiLink>
          </Typography>
        )}
      </div>
    </ThemeProvider>
  );
}
