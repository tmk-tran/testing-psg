import React from "react";
import Swal from "sweetalert2";
import { useTheme, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { User } from "../../hooks/reduxStore";
import { historyHook } from "../../hooks/useHistory";
import { dispatchHook } from "../../hooks/useDispatch";

const customTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 400,
      md: 1200, // Set to 1200px, breakpoint for navbar (display: none)
      lg: 1920,
      xl: 2400,
    },
  },
});

export default function BasicMenu() {
  const user = User();
  const history = historyHook();
  const dispatch = dispatchHook();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(customTheme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function newFundraiserForm() {
    history.push("/newFundraiser");
    handleClose();
  }

  function archivedOrganizations() {
    history.push("/archivedOrganizations");
    handleClose();
  }

  function goHome() {
    history.push("/home");
    handleClose();
  }

  function coupon() {
    history.push("/coupon");
    handleClose();
  }

  function aboutPage() {
    history.push("/about");
    handleClose();
  }

  function goToProfile() {
    history.push(`/userProfile/${user.id}`);
    handleClose();
  }

  function logOut() {
    Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({ type: "LOGOUT" });
        Swal.fire("Logged out!");
      }
    });
    handleClose();
  }

  return isSmallScreen ? (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={goHome}>Home</MenuItem>
        {/* <MenuItem onClick={goToProfile}>Profile</MenuItem> */}
        <hr style={{ width: "90%" }} />
        <MenuItem onClick={newFundraiserForm}>New Fundraiser</MenuItem>
        <MenuItem onClick={archivedOrganizations}>
          Archived Organizations
        </MenuItem>
        <MenuItem onClick={coupon}>Coupon</MenuItem>
        <MenuItem onClick={aboutPage}>About</MenuItem>
        {/* <hr /> */}
        {/* <MenuItem onClick={logOut}>Logout</MenuItem> */}
      </Menu>
    </div>
  ) : null;
}
