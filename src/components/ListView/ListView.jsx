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
  console.log(data.organization_logo_base64);
  console.log(data.merchant_logo_base64);
  console.log(isMerchantList);
  console.log(numCoupons);
  
  const user = User() || {};
  console.log(user);
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth);
  const aggs = useSelector((store) => store.organizations.
    aggs);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  console.log(editComplete);
  console.log(aggs)

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    onChange();
  };

  const renderLogoOrInitials = () => {
    return !isMerchantList ? (
      data.organization_logo_base64 ? (
        <ImageRender base64Logo={data.organization_logo_base64} />
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
    ) : data.merchant_logo_base64 ? (
      <ImageRender base64Logo={data.merchant_logo_base64} />
    ) : (
      <div className="initialsContainer">Merchant Logo</div>
    );
  };

  const handleArchive = (dataId) => {
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

            dispatch({
              type: `DELETE_${isMerchantList ? "MERCHANT" : "ORGANIZATION"}`,
              payload: isMerchantList ? { dataId, archiveReason } : { dataId },
            });

            dispatch({
              type: `FETCH_${isMerchantList ? "MERCHANTS" : "ORGANIZATIONS"}`,
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
      `/${isMerchantList ? "merchantTaskDetails" : "orgDetails"}/${data.id}`
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
                       {aggs.total_books_sold.map((totalBooksSold) => {
                    if (totalBooksSold.group_organization_id == data.id) {
                      return (
                        <>
                    <div className="column">
                      {/* ///////////////////////////////////////// */}
                      {/* ///////////// ORG INFORMATION /////////// */}
                      {/* ///////////////////////////////////////// */}
                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~~ EARNINGS ~~~~~~~~~~~~ */}
                   
                      <Typography variant="body2">
                        {!user.org_admin
                          ? `Organization Fee: $${data.organization_earnings}`
                          : null}
                      </Typography>

                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~ BOOKS SOLD ~~~~~~~~~~~ */}
                      <Typography key={totalBooksSold.id} variant="body2">
                              Total Books Sold: {totalBooksSold.sum}
                            </Typography>

                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~~ EARNINGS ~~~~~~~~~~~~ */}
                      <Typography variant="body2">
                        Organization Earnings: ${(data.organization_earnings * totalBooksSold.sum).toLocaleString()}
                      </Typography>
                    </div>

                    <div className="column">
                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~~~ GROUPS ~~~~~~~~~~~~~ */}
                      {aggs.total_groups.map((total_groups) => {
                              if (total_groups.organization_id == data.id) {
                                return (
                                  <Typography variant="body2">
                                    Total Groups: {total_groups.count}
                                  </Typography>
                                );
                              }
                            })}
                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~ TOTAL BOOKS ~~~~~~~~~~ */}
                      {result.map((totalStandingBooks) => {
                              if (totalStandingBooks.group_organization_id == data.id) {
                                return (
                                  <>
                                    <Typography variant="body2">
                                      Total Outstanding Books: {totalStandingBooks.difference}
                                    </Typography>

                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~ PSG EARNINGS ~~~~~~~~~ */}
                      <Typography variant="body2">
                        {!user.org_admin
                          ? `PSG Earnings: ${(
                            (totalBooksSold.sum * 25) -
                            (data.organization_earnings * totalBooksSold.sum)
                          ).toLocaleString()}`
                          : null}
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
                    <Typography>Coupon Count (Active): {numCoupons}</Typography>
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
            {aggs.total_open_fundraisers.map((total_active_fundraisers, index) => { 
    if (total_active_fundraisers.group_organization_id == data.id  && !isOrgAdmin)  {
        return (
            <Button
                key={index}
                onClick={(e) => {
                    e.stopPropagation();
                    handleArchive(data.id);
                }}
            >
                Archive
            </Button>
        );
    }
})}
            {isMerchantList && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleArchive(data.id);
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
