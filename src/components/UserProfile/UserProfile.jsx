import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Card, CardContent } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useHistory } from "react-router-dom";
import { capitalizeWords } from "../Utils/helpers.js";
import UserTable from "../UserTable/UserTable.jsx";

function UserProfile() {
  const auth = useSelector((store) => store.auth)
  useEffect(() => {
    dispatch({ type: "FETCH_GROUP_ADMIN", payload: auth });
    dispatch({ type: "FETCH_ORGANIZATIONS", payload: auth });
    dispatch({ type: "FETCH_ALL_USERS", payload: auth });
  }, []);

  const user = useSelector((store) => store.user);
  const groups = useSelector((store) => store.groupAdmin);
  const organizations = useSelector((store) => store.organizations);
  const totalOrganizations = organizations.length;
  const history = useHistory();

  // format date to mm/dd/yy
  const formatDate = (dateString) => {
    if (!dateString) {
      return " ";
    }
    const date = new Date(dateString); // Assuming the date string is in 'YYYY-MM-DD' format
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  // data to show the total groups for each organization
  let totalGroups = 0;
  for (let i = 0; i < organizations.length; i++) {
    const organization = organizations[i];
    totalGroups += parseInt(organization.total_groups, 10) || 0;
  }

  // total active fundraisers for each organization
  let totalActiveFundraisers = 0;
  for (let i = 0; i < organizations.length; i++) {
    const organization = organizations[i];
    totalActiveFundraisers +=
      parseInt(organization.total_active_fundraisers, 10) || 0;
  }

  // books sold for each organization
  let totalBooksSold = 0;
  for (let i = 0; i < organizations.length; i++) {
    const organization = organizations[i];
    totalBooksSold += parseInt(organization.total_books_sold, 10) || 0;
  }

  // price per book and money raised information
  const pricePerBook = 25;
  const totalMoneyRaised = totalBooksSold * pricePerBook;
  const formattedTotalMoneyRaised = totalMoneyRaised.toLocaleString();

  // total org earnings
  let totalOrgEarnings = 0;
  for (let i = 0; i < organizations.length; i++) {
    const organization = organizations[i];
    totalOrgEarnings += parseInt(organization.total_org_earnings, 10) || 0;
  }
  // math for organization cut and the total made minus the org cut
  const totalMinusOrgCut = totalMoneyRaised - totalOrgEarnings;
  const formattedTotalMinusOrg = totalMinusOrgCut.toLocaleString();

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <br />

        <Card
          elevation={2}
          className="headerCard"
          style={{ width: "95%", margin: "auto", marginBotton: "20px" }}
        >
          <CardContent>
            <center>
              <br />
              <Typography variant="h5" style={{ fontWeight: "bold" }}>
                Welcome, {user.username ? capitalizeWords(user.username) : ""}
              </Typography>
              {user.is_admin ? (
                <>
                  <Typography variant="h6">You are an Admin User</Typography>
                  <br />
                  <div className="fundraisersContainer">
                    <center>
                      <Card
                        elevation={3}
                        className="fundraiserCard"
                        style={{ width: "70%", marginBottom: "10px" }}
                      >
                        <CardContent>
                          <Typography
                            variant="subtitle1"
                            style={{ fontWeight: "bold", textDecoration: "underline", fontSize: "22px" }}
                          >
                            <b>PSG Details:</b>
                          </Typography>
                          <Typography variant="body2">
                            <b>Total Active Organizations:</b> {totalOrganizations}
                          </Typography>
                          <Typography variant="body2">
                            <b>Total Active Fundraisers:</b> {totalActiveFundraisers}
                          </Typography>
                          <Typography variant="body2">
                          <b>Total Books Sold:</b> {totalBooksSold.toLocaleString()} {totalBooksSold > 1000}

                          </Typography>
                          <Typography variant="body2">
                            <b>Total Money Rasied:</b> ${formattedTotalMoneyRaised}
                          </Typography>
                          <Typography variant="body2">
                            <b>PSG Earnings after Organization Fees:</b> $
                            {formattedTotalMinusOrg}
                          </Typography>
                        </CardContent>
                      </Card>
                      <br />
                      <br />
                    </center>
                    <UserTable />
                  </div>
                </>
              ) : (
                <>
                  {groups.length > 0 ? (
                    <Typography variant="h6">
                      Here are the groups that you are the admin of:
                    </Typography>
                  ) : (
                    <Typography variant="h6">
                      You are not the admin of any groups yet.
                    </Typography>
                  )}
                </>
              )}
            </center>
          </CardContent>
        </Card>
        <br />
        {groups?.map((group, index) => (
          <Card
            key={index}
            className="groupCard"
            style={{ width: "80%", margin: "auto" }}
          >
            <CardContent>
              <center>
                <Typography
                  variant="h6"
                  style={{ fontWeight: "bold", marginBottom: "10px" }}
                >
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
                        {fundraiser.title ? (
                          <>
                            <Typography
                              variant="subtitle1"
                              style={{ fontSize: "22px" }}
                            >
                              <b>Fundraiser Name:</b> {fundraiser.title}
                            </Typography>
                            <Typography variant="body2">
                              <b>Books Sold:</b> {fundraiser.books_sold}
                            </Typography>
                            <Typography variant="body2">
                              <b>Start Date:</b>{" "}
                              {formatDate(fundraiser.start_date)}
                            </Typography>
                            <Typography variant="body2">
                              <b>End Date:</b> {formatDate(fundraiser.end_date)}
                            </Typography>
                            <Typography variant="body2">
                              <b>Coupon book Year:</b>{" "}
                              {fundraiser.coupon_book_year}
                            </Typography>
                            <Typography variant="body2">
                              <b>Status:</b>{" "}
                              {fundraiser.closed ? "Closed" : "Active"}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="subtitle1">
                            No Fundraisers Entered
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </center>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

export default UserProfile;
