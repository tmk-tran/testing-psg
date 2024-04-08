import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import "./UserTable.css";
import UserTableRow from "../UserTableRow/UserTableRow.jsx";
import {
  TableCell,
  TableRow,
  Typography,
  Table,
  TableHead,
  TableBody,
} from "@mui/material";

function UserTable() {
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth)
  useEffect(() => {
    dispatch({ type: "FETCH_GROUP_ADMIN", payload: auth });
    dispatch({ type: "FETCH_ORGANIZATIONS", payload: auth });
    dispatch({ type: "FETCH_ALL_USERS", payload: auth });
  }, []);

  const user = useSelector((store) => store.user);
  const users = useSelector((store) => store.allUsers);
  const groups = useSelector((store) => store.groupAdmin);
  const organizations = useSelector((store) => store.organizations);

  // table for admin user page
  return (
    <>
      <Table style={{ width: "90%" }}>
        <TableHead>
          <TableRow
            className="active_row"
            style={{ border: "2px solid black" }}
          >
            <TableCell className="user_header_cell">
              <Typography
                className="user_header_text"
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Username
              </Typography>
            </TableCell>
            <TableCell
              className="user_header_cell"
              style={{
                whiteSpace: "nowrap", // Center align the content horizontally
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              <Typography
                className="user_header_text"
                style={{
                  fontSize: "20px",
                  textAlign: "center",
                  fontWeight: "bold",
                  margin: "auto",
                }}
              >
                Groups | Leader Status
              </Typography>
            </TableCell>

            <TableCell className="user_header_cell">
              <Typography
                className="user_header_text"
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Actions
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((user, index) => {
            return <UserTableRow key={index} user={user} />;
          })}
        </TableBody>
      </Table>
    </>
  );
}

export default UserTable;
