import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Card, CardContent, Typography } from "@mui/material";
import "./ListView.css";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import Swal from "sweetalert2";
import EditAccountModal from "../EditAccountModal/EditAccountModal";
import {
  backgroundColor,
  border,
  primaryColor,
  successColor,
} from "../Utils/colors";
import { User } from "../../hooks/reduxStore";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import ImageRender from "../ImageRender/ImageRender";

function ListView({
  data,
  isMerchantList,
  onChange,
  editComplete,
  isOrgAdmin,
  numCoupons,
}) {
  console.log(data);
  // console.log(data.organization_logo);
  // console.log(data.merchant_logo_base64);
  const history = useHistory();
  const dispatch = useDispatch();
  const user = User() || {};
  const auth = useSelector((store) => store.auth);
  const aggs = useSelector((store) => store.organizations.aggs);
  // console.log(aggs);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    onChange();
  };

  const renderLogoOrInitials = () => {
    return !isMerchantList ? (
      data.organization_logo ? (
        <ImageRender base64Logo={data.organization_logo} />
      ) : (
        <div className="initialsContainer">
          {data.organization_name
            ? data.organization_name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()
            : null}
        </div>
      )
    ) : data.merchant_logo ? (
      <ImageRender base64Logo={data.merchant_logo} />
    ) : (
      <div className="initialsContainer">Merchant Logo</div>
    );
  };

  const handleArchive = (data) => {
    Swal.fire({
      title: `Are you sure you want to Archive this ${
        isMerchantList ? "Merchant" : "Organization"
      }?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: backgroundColor.color,
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, Archive`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Please enter a reason for archiving",
          input: "text",
          showCancelButton: true,
          confirmButtonColor: backgroundColor.color,
          cancelButtonColor: "#d33",
          confirmButtonText: "Archive",
          inputValidator: (value) => {
            if (!value) {
              return "Please enter a reason!";
            }
          },
        }).then((reasonResult) => {
          if (reasonResult.isConfirmed) {
            const archiveReason = reasonResult.value;
            console.log(archiveReason);

            const archivedOrg = {
              id: data.id,
              name: data.organization_name,
              type: data.type,
              address: data.address,
              city: data.city,
              state: data.state,
              zip: data.zip,
              primary_contact_first_name: data.primary_contact_first_name,
              primary_contact_last_name: data.primary_contact_last_name,
              primary_contact_phone: Number(data.primary_contact_phone),
              primary_contact_email: data.primary_contact_email,
              is_deleted: true,
            };

            const archivedMerchant = {
              id: data.id,
              merchant_name: data.merchant_name,
              address: data.address,
              city: data.city,
              state: data.state,
              zip: data.zip,
              primary_contact_first_name: data.primary_contact_first_name,
              primary_contact_last_name: data.primary_contact_last_name,
              contact_phone_number: data.contact_phone,
              contact_email: data.contact_email,
              is_deleted: true,
              archive_reason: archiveReason,
            };

            dispatch({
              type: `DELETE_${isMerchantList ? "MERCHANT" : "ORGANIZATION"}`,
              payload: isMerchantList
                ? { archivedMerchant: archivedMerchant, auth: auth }
                : { archivedOrg: archivedOrg, auth: auth },
            });

            dispatch({
              type: `FETCH_${isMerchantList ? "MERCHANTS" : "ORGANIZATIONS"}`,
              payload: auth,
            });
            Swal.fire({
              icon: "success",
              title: `${
                isMerchantList ? "Merchant" : "Organization"
              } Successfully Archived!`,
            });
          }
        });
      }
    });
  };

  function goToDetails() {
    history.push(
      `/fargo/${isMerchantList ? "merchantTaskDetails" : "orgDetails"}/${
        data.id
      }`
    );
  }

  // formats the money amount to have a comma over $1000
  const totalOrgEarnings = parseFloat(data.total_org_earnings);
  const formattedEarnings = totalOrgEarnings.toLocaleString();

  // variables for the book amounts to be able to do the quick math here
  const totalCheckedOutBooks = aggs.total_books_checked_out;
  const totalCheckedInBooks = aggs.total_books_checked_in;
  const totalBooksSold = aggs.total_books_sold;
  const totalStandingBooks =
    totalCheckedOutBooks - totalCheckedInBooks - totalBooksSold;
  console.log(totalCheckedOutBooks);
  console.log(totalBooksSold);

  function calculateBooksDifference(checkedOut, checkedIn, sold) {
    const result = [];

    for (const bookCheckedOut of checkedOut) {
      for (const bookCheckedIn of checkedIn) {
        for (const bookSold of sold) {
          if (
            bookCheckedOut.group_organization_id ===
              bookCheckedIn.group_organization_id &&
            bookCheckedOut.group_organization_id ===
              bookSold.group_organization_id
          ) {
            const difference =
              bookCheckedOut.sum - bookCheckedIn.sum - bookSold.sum;
            result.push({
              group_organization_id: bookCheckedOut.group_organization_id,
              difference: difference,
            });
          }
        }
      }
    }

    return result;
  }

  const result = calculateBooksDifference(
    totalCheckedOutBooks,
    totalCheckedInBooks,
    totalBooksSold
  );

  return (
    <>
      <Card className="mainListContainer">
        <CardContent>
          <div className="contentClickable" onClick={goToDetails}>
            <div className="mainListHeader">
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~~ ORG LOGO  ~~~~~~~~~~~ */}
              {renderLogoOrInitials()}

              <div className="mainListDetails">
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~~~ NAME HEADER ~~~~~~~~~~ */}
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {!isMerchantList
                    ? data.organization_name
                    : data.merchant_name}
                </Typography>

                {!isMerchantList ? (
                  <div style={{ display: "flex" }}>
                    {aggs.total_books_sold.some(
                      (totalBooksSold) =>
                        totalBooksSold.group_organization_id == data.id
                    ) && (
                      <>
                        <div className="column">
                          {/* ///////////////////////////////////////// */}
                          {/* ///////////// ORG INFORMATION /////////// */}
                          {/* ///////////////////////////////////////// */}
                          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                          {/* ~~~~~~~~~~~ EARNINGS ~~~~~~~~~~~~ */}

                          <Typography variant="body2">
                            Organization Fee: ${data.organization_earnings}
                          </Typography>

                          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                          {/* ~~~~~~~~~~ BOOKS SOLD ~~~~~~~~~~~ */}
                          {totalBooksSold.map(
                            (totalBooks, index) =>
                              totalBooks.group_organization_id == data.id && ( // Check for matching ID
                                <>
                                  <Typography
                                    key={totalBooks.id}
                                    variant="body2"
                                  >
                                    Total Books Sold: {totalBooks.sum}
                                  </Typography>

                                  <Typography variant="body2">
                                    Organization Earnings: $
                                    {(
                                      data.organization_earnings *
                                      totalBooks.sum
                                    ).toLocaleString() || 0}
                                  </Typography>
                                </>
                              )
                          )}
                        </div>

                        <div className="column">
                          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                          {/* ~~~~~~~~~~~~ GROUPS ~~~~~~~~~~~~~ */}
                          {aggs.total_groups.map((total_groups) => {
                            if (total_groups.organization_id == data.id) {
                              return (
                                <Typography variant="body2">
                                  Total Groups: {total_groups.count || 0}
                                </Typography>
                              );
                            }
                          })}
                          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                          {/* ~~~~~~~~~~ TOTAL BOOKS ~~~~~~~~~~ */}
                          {result.map((outstandingBooks, index) => {
                            if (
                              outstandingBooks.group_organization_id == data.id
                            ) {
                              return (
                                <>
                                  <Typography variant="body2" key={index}>
                                    Total Outstanding Books:{" "}
                                    {outstandingBooks.difference}
                                  </Typography>

                                  {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                                  {/* ~~~~~~~~~~ PSG EARNINGS ~~~~~~~~~ */}
                                  <Typography variant="body2" key={index}>
                                    {!user.org_admin
                                      ? `PSG Earnings: ${
                                          (
                                            totalBooksSold[index].sum * 25 -
                                            data.organization_earnings *
                                              totalBooksSold[index].sum
                                          ).toLocaleString() || 0
                                        }`
                                      : null}
                                  </Typography>
                                </>
                              );
                            }
                          })}
                        </div>
                      </>
                    )}
                    {!aggs.total_books_sold.some(
                      (totalBooksSold) =>
                        totalBooksSold.group_organization_id == data.id
                    ) && (
                      <>
                        <div className="column">
                          <Typography variant="body2">
                            Organization Fee: ${data.organization_earnings}
                          </Typography>
                          <Typography variant="body2">
                            Total Books Sold: 0
                          </Typography>
                          <Typography variant="body2">
                            Organization Earnings: $0
                          </Typography>
                        </div>
                        <div className="column">
                          <Typography variant="body2">
                            Total Groups: 0
                          </Typography>
                          <Typography variant="body2">
                            Total Outstanding Books: 0
                          </Typography>
                          <Typography variant="body2">
                            PSG Earnings: $0
                          </Typography>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* ///////////////////////////////////////////// */}
                    {/* /////////// MERCHANT INFO /////////////////// */}
                    {/* ///////////////////////////////////////////// */}
                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                    {/* ~~~~~~~~~~ Display Number of Coupons (active) ~~~~~~~~~~ */}
                    {numCoupons.some((count) => count.merchant === data.id) ? (
                      <Typography>
                        Coupon Count (Active):{" "}
                        {numCoupons.find((count) => count.merchant === data.id)
                          ?.count || 0}
                      </Typography>
                    ) : (
                      <Typography>Coupon Count (Active): 0</Typography>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className="mainListActions"
            style={{
              marginTop:
                data.total_active_fundraisers <= 0 ? "-115px" : "-100px",
            }}
          >
            {!isOrgAdmin && (
              <Button
                style={{ marginRight: "14px" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(data.id);
                }}
              >
                Edit
              </Button>
            )}
            {aggs.total_open_fundraisers.map(
              (total_active_fundraisers, index) => {
                if (!isOrgAdmin) {
                  return (
                    <Button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchive(data);
                      }}
                    >
                      Archive
                    </Button>
                  );
                }
              }
            )}
            {isMerchantList && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleArchive(data);
                }}
              >
                Archive
              </Button>
            )}
          </div>
        </CardContent>

        <EditAccountModal
          open={isEditModalOpen}
          handleClose={handleEditClose}
          data={data}
          isMerchantList={isMerchantList}
        />
      </Card>
    </>
  );
}

export default ListView;
