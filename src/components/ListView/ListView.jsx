import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card, CardContent, Typography } from "@mui/material";
import "./ListView.css";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import Swal from "sweetalert2";
import { dispatchHook } from "../../hooks/useDispatch";
import { User } from "../../hooks/reduxStore";
import { backgroundColor } from "../Utils/colors";
// ~~~~~~~~~~ Components ~~~~~~~~~~ //
import ImageRender from "../ImageRender/ImageRender";
import EditAccountModal from "../EditAccountModal/EditAccountModal";

function ListView({ data, isMerchantList, onChange, isOrgAdmin, numCoupons }) {
  const history = useHistory();
  const dispatch = dispatchHook();
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const user = User() || {};

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    // Used to refresh page for Merchant account edit
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
      `/fargo/${isMerchantList ? "merchantTaskDetails" : "orgDetails"}/${
        data.id
      }`
    );
  }

  const totalOrgEarnings =
    data.total_org_earnings !== undefined
      ? parseFloat(data.total_org_earnings)
      : 0;
  const formattedEarnings = totalOrgEarnings.toLocaleString();

  const totalCheckedOutBooks = data.total_checked_out_books;
  const totalCheckedInBooks = data.total_checked_in_books;
  const totalBooksSold = data.total_books_sold;
  const totalStandingBooks =
    totalCheckedOutBooks - totalCheckedInBooks - totalBooksSold;
  // Added 4/19/24, per client request
  const orgBooksSold =
    Number(data.physical_book_cash || 0) +
    Number(data.physical_book_digital || 0) +
    Number(data.digital_book_credit || 0);
  const orgEarningsCalc =
    Number(orgBooksSold) * Number(data.organization_earnings);
  const psgEarningsCalc =
    (25 - Number(data.organization_earnings)) * Number(orgBooksSold);
  const donationsTotal =
    Number(data.total_donations) + Number(data.total_digital_donations);

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
                    <div className="column">
                      {/* ///////////////////////////////////////// */}
                      {/* ///////////// ORG INFORMATION /////////// */}
                      {/* ///////////////////////////////////////// */}
                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~~ ORG FEE ~~~~~~~~~~~~~ */}
                      <Typography variant="body2">
                        {!user.org_admin
                          ? `Organization Fee: $${data.organization_earnings}`
                          : null}
                      </Typography>

                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~~ EARNINGS ~~~~~~~~~~~~ */}
                      <Typography variant="body2">
                        Organization Earnings: ${orgEarningsCalc}
                      </Typography>

                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~~ Donations ~~~~~~~~~~~ */}
                      <Typography variant="body2">
                        Total Donations: ${donationsTotal}
                      </Typography>

                      {/* ~~~~~ For Groups ~~~~~ */}
                      {/* <Typography variant="body2">
                        Total Books Sold: {data.total_books_sold}
                      </Typography> */}

                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~~ EARNINGS ~~~~~~~~~~~~ */}
                      {/* <Typography variant="body2">
                        Organization Earnings: ${formattedEarnings}
                      </Typography> */}
                    </div>

                    <div className="column">
                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~~~ GROUPS ~~~~~~~~~~~~~ */}
                      {/* <Typography variant="body2">
                        Total Groups: {data.total_groups}
                      </Typography> */}

                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~ BOOKS SOLD ~~~~~~~~~~~ */}
                      <Typography variant="body2">
                        Total Books Sold: {orgBooksSold}
                      </Typography>
                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~ TOTAL BOOKS ~~~~~~~~~~ */}
                      {/* <Typography variant="body2">
                        Total Outstanding Books: {totalStandingBooks}
                      </Typography> */}
                      <Typography variant="body2">
                        Total Outstanding Books: {data.total_books_due}
                      </Typography>

                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~ TOTAL BOOKS ~~~~~~~~~~ */}
                      {/* <Typography variant="body2">
                        Total Outstanding Books: {totalStandingBooks}
                      </Typography> */}

                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~ PSG EARNINGS (groups) ~~~~~ */}
                      {/* <Typography variant="body2">
                        {!user.org_admin
                          ? `PSG Earnings: $${(
                              data.total_books_sold * 25 -
                              (data.total_org_earnings !== undefined
                                ? parseFloat(data.total_org_earnings)
                                : 0)
                            ).toLocaleString()}`
                          : null}
                      </Typography> */}
                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~ PSG EARNINGS ~~~~~~~~~ */}
                      <Typography variant="body2">
                        {!user.org_admin
                          ? `PSG Earnings: $${psgEarningsCalc}`
                          : null}
                      </Typography>
                    </div>
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

            {data.total_active_fundraisers <= 0 && !isOrgAdmin && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleArchive(data.id);
                }}
              >
                Archive
              </Button>
            )}

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
