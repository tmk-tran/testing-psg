import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TableCell,
  TableRow,
  Typography,
  Table,
  TableHead,
  TableBody,
} from "@mui/material";
import "./UserTable.css";

import { getCurrentSeason } from "../Utils/season.js";
import { appActiveYear } from "../../hooks/reduxStore.js";

import UserTableRow from "../UserTableRow/UserTableRow.jsx";

function UserTable() {
  const dispatch = useDispatch();

  const users = useSelector((store) => store.allUsers);
  // Active year
  const activeYearObj = getCurrentSeason(appActiveYear());
  const activeYearId = activeYearObj?.id || "";

  useEffect(() => {
    dispatch({ type: "FETCH_GROUP_ADMIN" });
    // dispatch({
    //   type: "FETCH_ORGANIZATIONS",
    //   payload: { bookId: activeYearId },
    // });
    dispatch({ type: "FETCH_ALL_USERS" });
  }, []);

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
