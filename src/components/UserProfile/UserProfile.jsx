import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  TextField,
  Paper,
  Pagination,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddOrganizationModal from "../AddOrganizationModal/AddOrganizationModal.jsx";
import { useHistory } from "react-router-dom";
import { capitalizeWords } from "../Utils/helpers.js";

function UserProfile() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "FETCH_GROUP_ADMIN" });
    dispatch({ type: "FETCH_ORGANIZATIONS" });
  }, []);

  const user = useSelector((store) => store.user);
  const groups = useSelector((store) => store.groupAdmin);
  console.log("GROUPS", groups);

  const history = useHistory();

  const formatDate = (dateString) => {
    if (!dateString) {
      return " ";
    }
    const date = new Date(dateString); // Assuming the date string is in 'YYYY-MM-DD' format
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <br />
      <Card
        elevation={2}
        className="headerCard"
        style={{ width: "90%", margin: "auto", marginBotton: "20px" }}
      >
        <CardContent>
          <center>
            <br />
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              Welcome, {user.username ? capitalizeWords(user.username) : ""}
            </Typography>
            {user.is_admin ? (
              <Typography variant="h6">
                You are the Administrator of PSG but here are also the groups
                that you are assigned the admin of:
              </Typography>
            ) : (
              <Typography variant="h6">
                Here are the groups that you are the admin of:
              </Typography>
            )}
          </center>
        </CardContent>
      </Card>
      <br />
      <br />
      {groups?.map((group, index) => (
        <Card
          key={index}
          className="groupCard"
          style={{ width: "80%", margin: "auto" }}
        >
          <CardContent>
            <center>
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                Group:{" "}
                {group.group_nickname
                  ? group.group_nickname
                  : "* No group name *"}{" "}
                in the {group.organization_name} Organization
              </Typography>
            </center>

            <div className="fundraisersContainer">
              {group.fundraisers_info?.map((fundraiser, subIndex) => (
                <center>
                  <Card
                    elevation={3}
                    key={subIndex}
                    className="fundraiserCard"
                    style={{ width: "70%", marginBottom: "10px" }}
                  >
                    <CardContent>
                      {/* Render details of each fundraiser */}
                      <Typography variant="subtitle1">
                        Fundraiser: {fundraiser.title}
                      </Typography>
                      <Typography variant="body2">
                        Books Requested: {fundraiser.books_requested}
                      </Typography>
                      <Typography variant="body2">
                        Books Sold: {fundraiser.books_sold}
                      </Typography>
                      <Typography variant="body2">
                        Start Date: {formatDate(fundraiser.start_date)}
                      </Typography>
                      <Typography variant="body2">
                        End Date: {formatDate(fundraiser.end_date)}
                      </Typography>
                      <Typography variant="body2">
                        Coupon book Year: {fundraiser.coupon_book_year}
                      </Typography>
                    </CardContent>
                  </Card>
                </center>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserProfile;