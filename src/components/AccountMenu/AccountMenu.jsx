import React from "react";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { historyHook } from "../../hooks/useHistory";
import { User } from "../../hooks/reduxStore";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import { Select, MenuItem, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import "./AccountMenu.css";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { dispatchHook } from "../../hooks/useDispatch";

export const headerMenuStyle = {
  backgroundColor: "#19338E",
  height: "48px",
  border: "1px solid gray",
  padding: "0 10px",
};

const AccountMenu = ({ isMobile }) => {
  const user = User();
  const history = historyHook();
  const dispatch = dispatchHook();

  const handleMenuChange = (event) => {
    // Handle menu item selection
    console.log(event.target.value);
  };

  return (
    <Select
      value=""
      onChange={handleMenuChange}
      displayEmpty
      inputProps={{ "aria-label": "Account Menu" }}
      style={{
        minWidth: isMobile ? "80px" : "120px",
        ...headerMenuStyle,
      }}
      renderValue={() => (
        <Typography
          style={{
            color: "white",
            display: "flex",
            alignItems: "center",
            fontSize: isMobile ? "0.8rem" : "inherit",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: isMobile ? 20 : null,
          }}
        >
          <PersonIcon sx={{ mr: 1.5, fontSize: isMobile ? 24 : "undefined" }} />
          {user.username}
        </Typography>
      )}
    >
      {[
        (user.is_admin || user.org_admin) && (
          <MenuItem
            key="profile"
            value="profile"
            onClick={() => {
              history.push(`/userProfile/${user.id}`);
            }}
          >
            Profile
          </MenuItem>
        ),
        (user.is_admin || user.org_admin) && (
          <hr key="divider" style={{ width: "90%" }} />
        ),
        user.is_admin && (
          <MenuItem
            key="organizations"
            value="organizations"
            onClick={() => {
              history.push("/fargo/home");
            }}
          >
            Home
          </MenuItem>
        ),
        user.is_admin && (
          <MenuItem
            key="tasks"
            value="tasks"
            onClick={() => {
              history.push("/fargo/tasks");
            }}
          >
            Tasks
          </MenuItem>
        ),
        user.is_admin && (
          <MenuItem
            key="transactions"
            value="transactions"
            onClick={() => {
              history.push("/fargo/transactions");
            }}
          >
            Transactions
          </MenuItem>
        ),
        user.is_admin && (
          <MenuItem
            key="users"
            value="users"
            onClick={() => {
              history.push("/fargo/useradmin");
            }}
          >
            User Roles
          </MenuItem>
        ),
        // user.is_admin && <hr key="divider2" style={{ width: "90%" }} />,
        user.is_admin && <hr key="divider2" style={{ width: "90%" }} />,
        <MenuItem
          key="logout"
          value="logout"
          onClick={() => dispatch({ type: "LOGOUT" })}
        >
          Logout
        </MenuItem>,
      ]}
    </Select>
  );
};

export default AccountMenu;
