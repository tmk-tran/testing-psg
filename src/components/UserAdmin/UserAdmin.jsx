import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import {
  Box,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
// ~~~~~~~~~ Hooks ~~~~~~~~~ //
import { dispatchHook } from "../../hooks/useDispatch";
import {
  userTableData,
  allOrganizations,
  userBooksData,
} from "../../hooks/reduxStore";
import { centerMe, containerStyle, flexRowSpace } from "../Utils/pageStyles";
import { showSaveSweetAlert } from "../Utils/sweetAlerts";
// ~~~~~~~~~ Components ~~~~~~~~~ //
import ActionSwitch from "./ActionSwitch";
import OrgMenu from "./OrgMenu";
import UserAdminHeader from "./UserAdminHeader";
import { useSelector } from "react-redux";

const pageHeaderStyle = {
  textAlign: "center",
  mb: 2,
};

const headerStyle = {
  border: "1px solid #f0f0f0",
  backgroundColor: "#d9d9d9",
  lineHeight: 1,
};

const shortHeaderCell = {
  width: 120,
};

const wideCellSx = {
  border: "1px solid #ddd",
};

const userNameCellSx = {
  maxWidth: 175,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  transition: "max-width 0.5s",
  cursor: "col-resize",
  ...wideCellSx,
};

const shortCellSx = {
  width: 120,
  border: "1px solid #ddd",
};

const disabledCellSx = {
  backgroundColor: "#eaeaea",
  color: "gray",
};

export default function UserAdmin() {
  const auth = useSelector((store) => store.auth);
  const roles = useSelector((store) => store.roles);
  const dispatch = dispatchHook();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  console.log(isHovered);

  isHovered
    ? (userNameCellSx.maxWidth = "none")
    : (userNameCellSx.maxWidth = 175);

  useEffect(() => {
    const action = {
      type: "FETCH_USER_TABLE",
      payload: auth,
    };
    dispatch(action);
    const action2 = {
      type: "FETCH_ORGANIZATIONS",
      payload: auth,
    };
    dispatch(action2);
    const action3 = {
      type: "FETCH_CONSUMER_BOOKS",
      payload: auth,
    };
    dispatch(action3);
  }, []);

  const tableData = userTableData() || [];
  const allOrgs = allOrganizations() || [];
  const userBooks = userBooksData() || [];

  const fuse = new Fuse(tableData, {
    keys: ["last_name"], // The 'merchant' field is used for searching
    includeScore: true,
    threshold: 0.3, // Adjust the threshold for fuzzy search accuracy
  });

  const handleSwitch = (id, type, newValue) => {
    console.log(id, type, newValue);

    if (type === "graphic_designer" || type === "org_admin") {
      const role_id = type === "graphic_designer" ? 3 : 2;
      const action = {
        type: "CHANGE_USER_ROLE",
        payload: {
          id: id,
          [type === "graphic_designer" ? "graphic_designer" : "org_admin"]:
            newValue,
          role_id,
        },
      };
      console.log(action);
      dispatch(action);
      showSaveSweetAlert({ label: "User Role Updated" });
    }

    if (type === "show_book") {
      const action2 = {
        type: "RELEASE_COUPON_BOOK",
        payload: {
          id: id,
          show_book: newValue,
        },
      };
      console.log(action2);
      dispatch(action2);
      showSaveSweetAlert({ label: "Book Access Updated" });
    }
  };

  const handleOrgSelect = (userId, id) => {
    const dispatchAction = {
      type: "SET_ORGANIZATION_ADMIN",
      payload: {
        id: userId,
        org_id: id,
        role_id: 2,
      },
    };
    console.log(dispatchAction);
    dispatch(dispatchAction);
    showSaveSweetAlert({ label: "Organization Admin Set" });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (value) => {
    console.log(value);
    setQuery(value);
    if (value.trim() === "") {
      setFilteredUsers([]);
    } else {
      const results = fuse.search(value);
      setFilteredUsers(results.map((result) => result.item));
    }
  };

  const filteredResults = tableData
    .map((user) => {
      const userShowBook =
        userBooks.find((book) => book.user_id === user.id)?.show_book ?? false;
      return { ...user, show_book: userShowBook };
    })
    .filter(
      (user) =>
        user.last_name &&
        user.last_name.toLowerCase().includes(query.toLowerCase())
    );

  const clearInput = () => {
    setQuery("");
    setCurrentPage(1); // Reset to the first page when clearing the search
  };

  return (
    <div style={{ ...containerStyle }}>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ Header ~~~~~~~~~~ */}
      <UserAdminHeader
        query={query}
        onChange={handleSearch}
        clearInput={clearInput}
        pageHeaderStyle={pageHeaderStyle}
        isModalOpen={isModalOpen}
        handleOpenModal={handleOpenModal}
        handleCloseModal={handleCloseModal}
      />
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ Table ~~~~~~~~~~ */}
      <TableContainer sx={{ maxHeight: "600px", overflow: "auto" }}>
        <Table stickyHeader>
          {/* ~~~~~~~~~~ HEAD ~~~~~~~~~~ */}
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>Last Name</TableCell>
              <TableCell sx={headerStyle}>First Name</TableCell>
              <TableCell sx={headerStyle}>Username</TableCell>
              <TableCell
                sx={{ ...headerStyle, ...shortHeaderCell, ...centerMe }}
              >
                Graphic Designer
              </TableCell>
              <TableCell
                sx={{ ...headerStyle, ...shortHeaderCell, ...centerMe }}
              >
                Organization Admin
              </TableCell>
              <TableCell sx={{ ...headerStyle, ...centerMe }}>
                Organization Name
              </TableCell>
              <TableCell sx={{ ...headerStyle, ...centerMe }}>
                Coupon Book
              </TableCell>
            </TableRow>
          </TableHead>
          {/* ~~~~~~~~~~ BODY ~~~~~~~~~~ */}
          <TableBody>
            {filteredResults.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{
                  bgcolor:
                    index % 2 === 0 ? "rgba(0, 0, 0, 0.04)" : "transparent",
                }}
              >
                <TableCell sx={wideCellSx}>{row.last_name}</TableCell>
                <TableCell sx={wideCellSx}>{row.first_name}</TableCell>
                <TableCell
                  sx={userNameCellSx}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <strong>{row.username}</strong>
                </TableCell>
                <TableCell
                  sx={{
                    ...shortCellSx,
                    ...centerMe,
                    ...(row.id === 3 || row.id === 4 ? disabledCellSx : {}),
                  }}
                >
                  {/* ~~~~~~~~~ Graphic Designer Column ~~~~~~~~~~ */}
                  {row.graphic_designer ? (
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ display: "inline" }}
                    >
                      Yes
                    </Typography>
                  ) : (
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ display: "inline" }}
                    >
                      No
                    </Typography>
                  )}
                  {row.id === 3 || row.id === 4 ? (
                    <ActionSwitch
                      disabled={true}
                      isChecked={row.graphic_designer}
                      onChange={(newValue) =>
                        handleSwitch(row.id, "graphic_designer", newValue)
                      }
                    />
                  ) : (
                    <ActionSwitch
                      isChecked={row.graphic_designer}
                      onChange={(newValue) =>
                        handleSwitch(row.id, "graphic_designer", newValue)
                      }
                    />
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    ...shortCellSx,
                    ...centerMe,
                    ...(row.id === 3 || row.id === 4 ? disabledCellSx : {}),
                  }}
                >
                  {/* ~~~~~~~~~ Org Admin Column ~~~~~~~~~~ */}
                  {row.org_admin ? (
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ display: "inline" }}
                    >
                      Yes
                    </Typography>
                  ) : (
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ display: "inline" }}
                    >
                      No
                    </Typography>
                  )}
                  {row.id === 3 || row.id === 4 ? (
                    <ActionSwitch
                      disabled={true}
                      isChecked={row.org_admin}
                      onChange={(newValue) =>
                        handleSwitch(row.id, "org_admin", newValue)
                      }
                    />
                  ) : (
                    <ActionSwitch
                      isChecked={row.org_admin}
                      onChange={(newValue) =>
                        handleSwitch(row.id, "org_admin", newValue)
                      }
                    />
                  )}
                </TableCell>
                <TableCell sx={{ ...wideCellSx, ...centerMe, maxWidth: 150 }}>
                  {row.org_admin ? (
                    <OrgMenu
                      userId={row.id}
                      organizations={allOrgs}
                      defaultValue={row.org_id}
                      onChange={handleOrgSelect}
                    />
                  ) : null}
                </TableCell>
                <TableCell sx={{ ...shortCellSx, ...centerMe }}>
                  {row.show_book ? (
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ display: "inline" }}
                    >
                      Yes
                    </Typography>
                  ) : (
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ display: "inline" }}
                    >
                      No
                    </Typography>
                  )}
                  <ActionSwitch
                    isChecked={row.show_book}
                    onChange={(newValue) =>
                      handleSwitch(row.id, "show_book", newValue)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
