import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Button, Paper, Pagination, Typography, Tooltip } from "@mui/material";
import "./HomePage.css";
import Fuse from "fuse.js";
import AddBoxIcon from "@mui/icons-material/AddBox";
// ~~~~~~~~~~ Components ~~~~~~~~~~~~~~ //
import AddAccountModal from "../AddAccountModal/AddAccountModal.jsx";
import ListView from "../ListView/ListView.jsx";
import SearchBar from "../SearchBar/SearchBar.jsx";
import ToggleButton from "../ToggleButton/ToggleButton.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import {
  User,
  allMerchants,
  allOrganizations,
  mCoupons,
} from "../../hooks/reduxStore.js";
import { buttonIconSpacing } from "../Utils/helpers.js";

function HomePage({ isOrgAdmin, orgAdminId, isGraphicDesigner }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isMerchantList, setIsMerchantList] = useState(
    false || Cookies.get("isMerchantList") === "true"
  );
  // state for the search, modal, and pagination //
  const [query, setQuery] = useState(" ");
  const [showInput, setShowInput] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editComplete, setEditComplete] = useState(false);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
  // ~~~~~~~~~~~~~~~~~~~~ Store ~~~~~~~~~~~~~~~~~~~~ //
  const auth = useSelector((store) => store.auth);
  const user = User();
  const organizationsList = allOrganizations() || [];
  console.log(organizationsList);
  const merchants = allMerchants() || [];
  const couponNumbers = mCoupons() || [];
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  const itemsPerPage = 12;
  const handleToggle = () => {
    const newIsMerchantList = !isMerchantList;
    Cookies.set("isMerchantList", newIsMerchantList, { expires: 365 });
    setIsMerchantList(newIsMerchantList);
  };

  useEffect(() => {
    console.log("Dispatching data fetch action...");
    dispatch({ type: "FETCH_ORGANIZATIONS", payload: auth });
    dispatch({ type: "FETCH_MERCHANTS", payload: auth });
  }, [auth]);

  useEffect(() => {
    if (organizationsList.length > 0 && merchants.length > 0) {
      setIsLoading(false);
    }
  }, [organizationsList, merchants]);

  useEffect(() => {
    const initialIsMerchantList =
      false || Cookies.get("isMerchantList") === "true";
    setIsMerchantList(initialIsMerchantList);
  }, []);

  useEffect(() => {
    const dispatchAction = isMerchantList && "FETCH_COUPON_NUMBER";
    dispatch({ type: dispatchAction, payload: auth });

    // If editComplete is true, trigger refresh and reset editComplete
    if (editComplete) {
      dispatch({ type: "FETCH_ORGANIZATIONS", payload: auth });
      dispatch({ type: "FETCH_MERCHANTS", payload: auth });
      setEditComplete(false);
    }
  }, [isMerchantList, editComplete]);

  // ~~~~~~~~~~~ For fuzzy search ~~~~~~~~~ //
  const listToSearch = !isMerchantList ? organizationsList : merchants;
  const keys = !isMerchantList ? ["organization_name"] : ["merchant_name"];
  const fuse = new Fuse(listToSearch, {
    keys: keys,
    includeScore: true,
    threshold: 0.3,
    minMatchCharLength: 2,
  });
  const results = fuse.search(query);
  const searchResult = results.map((result) => result.item);

  const handleOnSearch = (value) => {
    console.log(value);
    setQuery(value);
    if (!showInput) {
      setShowInput(true);
    }
    setCurrentPage(1); // Reset to the first page when searching
  };
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  // clears out the input field
  const clearInput = () => {
    setQuery("");
    // setShowInput(false);
    setCurrentPage(1); // Reset to the first page when clearing the search
  };

  // Opens AddAccountModal
  const handleAddAccountClick = () => {
    setModalOpen(true);
  };
  // Closes AddAccountModal
  const handleModalClose = () => {
    setModalOpen(false);
  };

  // Index for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems =
    searchResult.length > 0
      ? searchResult.slice(indexOfFirstItem, indexOfLastItem)
      : isMerchantList
      ? merchants.slice(indexOfFirstItem, indexOfLastItem)
      : organizationsList?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const totalItems =
    searchResult.length > 0
      ? searchResult.length
      : !isMerchantList
      ? organizationsList?.length || 0
      : merchants.length;
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEdit = () => {
    setEditComplete(true);
  };

  function createCouponCount(merchants, coupons) {
    const couponCount = [];

    for (const merchant of merchants) {
      console.log(merchant);
      for (const coupon of coupons) {
        console.log(coupon);
        if (merchant.id == coupon.merchant_id) {
          console.log(
            "Merchant ID:",
            merchant.id,
            "Coupon Merchant ID:",
            coupon.merchant_id
          );
          couponCount.push({
            merchant: merchant.id,
            count: coupon.count,
          });
        }
      }
    }
    return couponCount;
  }

  const couponCount = createCouponCount(merchants, couponNumbers);
  console.log(couponCount);
  
  return (
    <div className="organizationsContainer">
      <Paper elevation={3} style={{ width: "90%", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~ TOGGLE VIEWS ~~~~~~~~~~ */}
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {!isOrgAdmin && !isGraphicDesigner && (
            <ToggleButton
              sxButton={{ margin: 2 }}
              sxIcon={{ mr: 1 }}
              title="Toggle List View"
              onClick={handleToggle}
              label1="Merchants"
              label2="Organizations"
              toggleState={isMerchantList}
            />
          )}
          {isOrgAdmin && isGraphicDesigner && (
            <ToggleButton
              sxButton={{ margin: 2 }}
              sxIcon={{ mr: 1 }}
              title="Toggle List View"
              onClick={handleToggle}
              label1="Merchants"
              label2="Organizations"
              toggleState={isMerchantList}
            />
          )}
        </div>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ PAGE HEADER ~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            mt: isOrgAdmin ? 3 : isGraphicDesigner ? 3 : 0,
          }}
        >
          {!isMerchantList ? "Organization List" : "Merchant List"}
        </Typography>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~ SEARCH BAR AND ADD BUTTON ~~~~~~ */}
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              // justifyContent: "center",
              justifyContent: "space-between",
              marginTop: "16px",
              width: "85%",
            }}
          >
            {!isMerchantList ? (
              <SearchBar
                isOrganization={true}
                query={query}
                onChange={handleOnSearch}
                clearInput={clearInput}
              />
            ) : (
              <SearchBar
                isOrganization={false}
                query={query}
                onChange={handleOnSearch}
                clearInput={clearInput}
              />
            )}
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~ Add Account Button ~~~~~~~~~~ */}
            {!isOrgAdmin && (
              <Tooltip title="Add a New Account">
                <Button
                  style={{ marginBottom: "5px" }}
                  // variant="outlined"
                  onClick={handleAddAccountClick}
                >
                  {!isMerchantList ? (
                    <>
                      <AddBoxIcon sx={buttonIconSpacing} />
                      Organization
                    </>
                  ) : (
                    <>
                      <AddBoxIcon sx={buttonIconSpacing} />
                      Merchant
                    </>
                  )}
                </Button>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="organizationsContainer">
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~~~~~~~~~ List Cards ~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~ Loading Page Spinner ~~~~~ */}
          {isLoading && (
            <LoadingSpinner
              text="Loading from database..."
              finalText="Oops! ...unexpected error. Please logout, then login again"
            />
          )}
          {!isLoading &&
            (isMerchantList
              ? currentItems.map((merchant, index) => (
                  <ListView
                    key={index}
                    data={merchant}
                    isMerchantList={true}
                    onChange={handleEdit}
                    numCoupons={couponCount || 0}
                  />
                ))
              : currentItems.map((organization, index) =>
                  (isOrgAdmin && Number(organization.id) === orgAdminId) ||
                  (!isOrgAdmin && user.is_admin) ? (
                    <ListView
                      key={index}
                      data={organization}
                      isMerchantList={false}
                      onChange={handleEdit}
                      isOrgAdmin={
                        isOrgAdmin && Number(organization.id) === orgAdminId
                      }
                    />
                  ) : null
                ))}
        </div>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~~~~~~ Add New Org ~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        <AddAccountModal
          open={isModalOpen}
          handleModalClose={handleModalClose}
          isMerchantList={isMerchantList}
        />
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={pageCount}
            shape="rounded"
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </div>

        <br />
      </Paper>
    </div>
  );
}

export default HomePage;
