import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Tooltip,
} from "@mui/material";
// ~~~~~~~~~ Hooks ~~~~~~~~~ //
import { dispatchHook } from "../../hooks/useDispatch";
import {
  userTableData,
  UserOrgAdmins,
  allOrganizations,
  userBooksData,
} from "../../hooks/reduxStore";
import { centerMe, containerStyle, flexRowSpace } from "../Utils/pageStyles";
import { showDeleteSweetAlert, showSaveSweetAlert } from "../Utils/sweetAlerts";
import { successColor } from "../Utils/colors";
// ~~~~~~~~~ Components ~~~~~~~~~ //
import ActionSwitch from "./ActionSwitch";
import UserAdminHeader from "./UserAdminHeader";
import OrgAdminCell from "./OrgAdminCell";
import AddOrgBtn from "./AddOrgBtn";
import OrgMenu from "./OrgMenu";
import UserActions from "./UserActions";
import ActionButton from "../OrgSellers/ActionButton";
import EditUsernameField from "./EditUsernameField";

const pageBoxStyle = {
  width: "80%",
  margin: "0 auto",
};

const pageHeaderStyle = {
  fontWeight: "bold",
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
  maxWidth: 140,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const userNameCellSx = {
  maxWidth: 175,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  transition: "max-width 0.5s",
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
  // Removed auth store from this component
  const dispatch = dispatchHook();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [addNewOrg, setAddNewOrg] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  // ~~~~~~~~~ State for Edit ~~~~~~~~~ //
  const [editMode, setEditMode] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [newUserName, setNewUserName] = useState(null);

  isHovered
    ? (userNameCellSx.maxWidth = "none")
    : (userNameCellSx.maxWidth = 175);

  useEffect(() => {
    const action = {
      type: "FETCH_USER_TABLE",
      // payload: auth,
    };
    dispatch(action);
    const action2 = {
      type: "FETCH_ORGANIZATIONS",
      // payload: auth,
    };
    dispatch(action2);
    const action3 = {
      type: "FETCH_CONSUMER_BOOKS",
      // payload: auth,
    };
    dispatch(action3);
    const action4 = {
      type: "FETCH_ORG_ADMINS",
    };
    dispatch(action4);
  }, []);

  const tableData = userTableData() || [];
  const orgAdmins = UserOrgAdmins() || [];
  const allOrgs = allOrganizations() || [];
  const userBooks = userBooksData() || [];

  const fuse = new Fuse(tableData, {
    keys: ["last_name"], // The 'merchant' field is used for searching
    includeScore: true,
    threshold: 0.3, // Adjust the threshold for fuzzy search accuracy
  });

  const handleSwitch = (id, type, newValue) => {
    if (type === "graphic_designer" || type === "org_admin") {
      const action = {
        type: "CHANGE_USER_ROLE",
        payload: {
          id: id,
          [type === "graphic_designer" ? "graphic_designer" : "org_admin"]:
            newValue,
        },
      };
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
      dispatch(action2);
      showSaveSweetAlert({ label: "Book Access Updated" });
    }
  };

  const handleOrgSelect = (userId, currentId, newId) => {
    if (userId && currentId && newId) {
      const dispatchAction = {
        type: "REPLACE_ORG_ID",
        payload: {
          currentId: currentId,
          user_id: userId,
          org_id: newId,
        },
      };
      dispatch(dispatchAction);
      showSaveSweetAlert({ label: "Organization Admin Set" });
      setAddNewOrg(false);
    }

    if (userId && newId && !currentId) {
      const addAction = {
        type: "ADD_ORG_ADMIN",
        payload: {
          user_id: userId,
          org_id: newId,
        },
      };
      dispatch(addAction);
    }
  };

  const handleAddOrg = (userId) => {
    setAddNewOrg(true);
    setSelectedUserId(userId);
  };

  const deleteOrgAdmin = (userId, orgId) => {
    const deleteAction = {
      type: "DELETE_ORG_ID",
      payload: {
        user_id: userId,
        org_id: orgId,
      },
    };

    showDeleteSweetAlert(() => {
      dispatch(deleteAction);
    }, "removeOrgAdmin");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (value) => {
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
      // look inside userBooks.unredeemed array instead of userBooks itself
      const userShowBook =
        userBooks.unredeemed.find((book) => book.user_id === user.id)
          ?.show_book ?? false;

      return { ...user, show_book: userShowBook }; // merge show_book into user
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

  const startEdit = (userId) => {
    setUserToEdit(userId);
    setEditMode(true);
  };

  const handleEditUser = () => {
    const editAction = {
      type: "EDIT_USER_NAME",
      payload: {
        id: userToEdit,
        username: newUserName,
      },
    };
    dispatch(editAction);
    resetEditUser();

    showSaveSweetAlert({ label: "User Name Updated" });
  };

  const resetEditUser = () => {
    setEditMode(false);
    setUserToEdit(null);
    setNewUserName(null);
  };

  const handleDeleteUser = (userId) => {
    const deleteAction = {
      type: "DELETE_USER",
      payload: {
        id: userId,
      },
    };

    showDeleteSweetAlert(() => {
      dispatch(deleteAction);
    }, "deleteUser");
  };

  return (
    <Box sx={pageBoxStyle}>
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
              <TableCell sx={{ ...headerStyle, ...centerMe }}>
                Actions
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
                <TableCell sx={wideCellSx}>
                  <Tooltip title={row.last_name}>
                    <span>{row.last_name}</span>
                  </Tooltip>
                </TableCell>
                <TableCell sx={wideCellSx}>
                  <Tooltip title={row.first_name}>
                    <span>{row.first_name}</span>
                  </Tooltip>
                </TableCell>
                {/* ~~~~~~~~~~ Username Column ~~~~~~~~~~ */}
                <TableCell>
                  {editMode && userToEdit === row.id ? (
                    <EditUsernameField
                      newUserName={newUserName}
                      setNewUserName={setNewUserName}
                      resetEditUser={resetEditUser}
                      handleEditUser={handleEditUser}
                    />
                  ) : (
                    <strong>{row.username}</strong>
                  )}
                </TableCell>
                {/* ~~~~~~~~~ Graphic Designer Column ~~~~~~~~~~ */}
                <TableCell
                  sx={{
                    ...shortCellSx,
                    ...centerMe,
                    ...(row.id === 3 ||
                    row.id === 4 ||
                    row.id === 23 ||
                    row.id === 24
                      ? disabledCellSx
                      : {}),
                  }}
                >
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
                  {row.id === 3 ||
                  row.id === 4 ||
                  row.id === 23 ||
                  row.id === 24 ? (
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
                {/* ~~~~~~~~~ Org Admin Column ~~~~~~~~~~ */}
                <TableCell
                  sx={{
                    ...shortCellSx,
                    ...centerMe,
                    ...(row.id === 3 ||
                    row.id === 4 ||
                    row.id === 23 ||
                    row.id === 24
                      ? disabledCellSx
                      : {}),
                  }}
                >
                  <Box sx={{ ...flexRowSpace, position: "relative" }}>
                    <Box>
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
                      {row.id === 3 ||
                      row.id === 4 ||
                      row.id === 23 || // will be different in PROD
                      row.id === 24 ? ( // will be different in PROD
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
                    </Box>
                    {/* ~~~~~ Add Org button ~~~~~ */}
                    <Box sx={{ position: "absolute", right: 0, top: -2 }}>
                      <AddOrgBtn
                        title="Assign New Org"
                        disabled={!row.org_admin}
                        sx={{
                          fontSize: 18,
                          color: !row.org_admin ? "gray" : successColor.color,
                        }}
                        onClick={() => handleAddOrg(row.id)}
                      />
                    </Box>
                  </Box>
                </TableCell>
                {/* ~~~~~ Org Admin Select Menu ~~~~~ */}
                <TableCell sx={{ ...wideCellSx, ...centerMe, maxWidth: 240 }}>
                  <OrgAdminCell
                    orgAdmins={orgAdmins}
                    row={row}
                    allOrgs={allOrgs}
                    handleOrgSelect={handleOrgSelect}
                    removeOrg={deleteOrgAdmin}
                    setAddNewOrg={setAddNewOrg}
                  />
                  {row.org_admin && row.id === selectedUserId && addNewOrg ? (
                    <OrgMenu
                      userId={row.id}
                      organizations={allOrgs}
                      defaultValue={row.org_id}
                      onChange={handleOrgSelect}
                      setAddNewOrg={setAddNewOrg}
                    />
                  ) : null}
                </TableCell>
                {/* ~~~~~~~~~~ Coupon Book Column ~~~~~~~~~~~ */}
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
                {/* ~~~~~~~~~~ Actions Column ~~~~~~~~~~ */}
                <TableCell sx={{ ...shortCellSx, ...centerMe }}>
                  <UserActions
                    user={row}
                    startEdit={startEdit}
                    handleDelete={handleDeleteUser}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
