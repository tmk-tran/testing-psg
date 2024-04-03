import React from "react";
import Swal from "sweetalert2";
import { createTheme } from "@mui/material/styles";
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
  const isSmallScreen = useMediaQuery(customTheme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goHome = () => {
    history.push("/fargo/home");
    handleClose();
  };

  const newFundraiserForm = () => {
    history.push("/fargo/newFundraiser");
    handleClose();
  };

  const archivedOrganizations = () => {
    history.push("/fargo/archivedOrganizations");
    handleClose();
  };

  const coupon = () => {
    history.push("/fargo/coupon");
    handleClose();
  };

  const tasks = () => {
    history.push("/fargo/tasks");
    handleClose();
  };

  const transactions = () => {
    history.push("/fargo/transactions");
    handleClose();
  };

  const goToProfile = () => {
    history.push(`/userProfile/${user.id}`);
    handleClose();
  };

  const logOut = () => {
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
  };

  return isSmallScreen && user.id ? (
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
        {/* ~~~~~ Home ~~~~~ */}
        <MenuItem onClick={goHome}>Home</MenuItem>
        {/* <MenuItem onClick={goToProfile}>Profile</MenuItem> */}
        <hr style={{ width: "90%" }} />
        {/* ~~~~~ New Fundraiser ~~~~~ */}
        {user.is_admin && (
          <MenuItem onClick={newFundraiserForm}>New Fundraiser</MenuItem>
        )}
        {/* ~~~~~ Archived Orgs ~~~~~ */}
        {user.is_admin && (
          <MenuItem onClick={archivedOrganizations}>
            Archived Organizations
          </MenuItem>
        )}
        {/* ~~~~~ Coupons ~~~~~ */}
        <MenuItem onClick={coupon}>Coupon</MenuItem>
        {(user.is_admin || user.graphic_designer) && (
          <MenuItem onClick={tasks}>Tasks</MenuItem>
        )}
        {/* ~~~~~ Transactions ~~~~~ */}
        {user.is_admin && (
          <MenuItem onClick={transactions}>Transactions</MenuItem>
        )}
        {/* <hr /> */}
        {/* <MenuItem onClick={logOut}>Logout</MenuItem> */}
      </Menu>
    </div>
  ) : null;
}
