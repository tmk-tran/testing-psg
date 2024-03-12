import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import Swal from "sweetalert2";
import "./ArchivedOrganizationCard.css";
import { successColor } from "../Utils/colors";

function ArchivedOrganizationCard({ organization }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const auth = useSelector((store) => store.auth);
  const aggs = useSelector((store) => store.organizations.
  aggs)

  // function to re activate organization and dispatch the data
  // sweet alert to confirm
  function unArchive(organizationId) {
    const resetOrg = {  
      id: organizationId,
      organization_name: organization.organization_name,
      type: organization.type,
      address: organization.address,
      city: organization.city,
      state: organization.state,
      zip: organization.zip,
      primary_contact_first_name: organization.primary_contact_first_name,
      primary_contact_last_name: organization.primary_contact_last_name,
      primary_contact_phone: organization.primary_contact_phone,
      primary_contact_email: contactEmail,
      organization_logo: logoUrl,
      organization_earnings: orgEarnings,
      is_delete: false};
    Swal.fire({
      title: "Are you sure you want to restore this organization?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: successColor.color,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, restore it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({ type: "RESET_ORGANIZATION", payload: {resetOrg: resetOrg, auth:auth } });
        dispatch({ type: "FETCH_ORGANIZATIONS", payload: auth });
        dispatch({ type: "FETCH_ARCHIVED_ORGANIZATIONS", payload: auth });
        Swal.fire("Organization successfully restored!");
      }
    });
  }
  // if no picture this function will render intials of the organization
  const renderLogoOrInitials = () => {
    if (organization.organization_logo) {
      return (
        <img
          className="archivedLogoImage"
          src={organization.organization_logo}
          alt="Organization Logo"
        />
      );
    } else {
      // If no logo, display initials of organization name
      const initials = organization.organization_name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
      return <div className="initialsContainer">{initials}</div>;
    }
  };

  // formatting some of the data to render on the card
  const totalOrgEarnings = parseFloat(organization.total_org_earnings);
  const formattedEarnings = totalOrgEarnings.toLocaleString();

  // variables for the book amounts to be able to do the quick math here
  const totalCheckedOutBooks = aggs.total_books_checked_out;
  const totalCheckedInBooks = aggs.total_books_checked_in;
  const totalBooksSold = aggs.total_books_sold;
  const totalStandingBooks =
    totalCheckedOutBooks - totalCheckedInBooks - totalBooksSold;
  console.log(totalCheckedOutBooks)


  function calculateBooksDifference(checkedOut, checkedIn, sold) {
    const result = [];

    for (const bookCheckedOut of checkedOut) {
      for (const bookCheckedIn of checkedIn) {
        for (const bookSold of sold) {
          if (bookCheckedOut.group_organization_id === bookCheckedIn.group_organization_id &&
            bookCheckedOut.group_organization_id === bookSold.group_organization_id) {

            const difference = bookCheckedOut.sum - bookCheckedIn.sum - bookSold.sum;
            result.push({
              group_organization_id: bookCheckedOut.group_organization_id,
              difference: difference
            });

          }
        }
      }
    }

    return result;
  }

  const result = calculateBooksDifference(totalCheckedOutBooks, totalCheckedInBooks, totalBooksSold);

  return (
    <>
      <Card className="archivedOrganizationListContainer">
        <CardContent>
          <div className="archivedOrganizationClickable">
            <div className="archivedOrganizationHeader">
              {renderLogoOrInitials()}
              <div className="archivedOrganizationDetails">
                <Typography
                  className="media-header"
                  variant="h6"
                  sx={{ mt: 0, fontWeight: "bold" }}
                >
                  {organization.organization_name}
                </Typography>
                <div className="detailsContainer">
                  {aggs.total_books_sold.map((totalBooksSold) => {
                    if (totalBooksSold.group_organization_id == organization.id) {
                      return (
                        <>
                          <div className="column">
                            <Typography variant="body2">
                              Organization Fee: ${organization.organization_earnings}
                            </Typography>

                            <Typography key={totalBooksSold.id} variant="body2">
                              Total Books Sold: {totalBooksSold.sum}
                            </Typography>

                            <Typography variant="body2">
                              Organization Earnings: ${(organization.organization_earnings * totalBooksSold.sum).toLocaleString()}
                            </Typography>

                          </div>
                          <div className="column">
                            {aggs.total_groups.map((total_groups) => {
                              if (total_groups.organization_id == organization.id) {
                                return (
                                  <Typography variant="body2">
                                    Total Groups: {total_groups.count}
                                  </Typography>
                                );
                              }
                            })}
                            {result.map((totalStandingBooks) => {
                              if (totalStandingBooks.group_organization_id == organization.id) {
                                return (
                                  <>
                                    <Typography variant="body2">
                                      Total Outstanding Books: {totalStandingBooks.difference}
                                    </Typography>
                                    <Typography variant="body2">
                                      PSG Earnings: $
                                      {(
                                        (totalBooksSold.sum * 25) -
                                        (organization.organization_earnings * totalBooksSold.sum)
                                      ).toLocaleString()}
                                    </Typography>
                                  </>
                                )
                              }
                            })}
                          </div>
                        </>
                      );
                    }
                  })}
                  </div>
              </div>
            </div>
          </div>

          <div
            className="archivedOrganizationActions"
            style={{ marginTop: "-150px" }}
          >
            <Button
              sx={{ mr: 2 }}
              onClick={(e) => {
                e.stopPropagation();
                unArchive(organization.id);
              }}
            >
              Restore
            </Button>
          </div>
        </CardContent>
      </Card>
      <br />
    </>
  );
}

// this allows us to use <App /> in index.js
export default ArchivedOrganizationCard;
