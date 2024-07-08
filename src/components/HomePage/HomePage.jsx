import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Paper,
  Pagination,
  Typography,
  Fab,
  Tooltip,
} from "@mui/material";
import "./HomePage.css";
import Fuse from "fuse.js";
import AddBoxIcon from "@mui/icons-material/AddBox";
// ~~~~~~~~~~ Components ~~~~~~~~~~~~~~
import AddAccountModal from "../AddAccountModal/AddAccountModal.jsx";
import ListView from "../ListView/ListView.jsx";
import SearchBar from "../SearchBar/SearchBar.jsx";
import ToggleButton from "../ToggleButton/ToggleButton.jsx";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { allMerchants, mCoupons } from "../../hooks/reduxStore.js";
import { buttonIconSpacing } from "../Utils/helpers.js";
import { dispatchHook } from "../../hooks/useDispatch.js";

function HomePage({ isOrgAdmin, isGraphicDesigner, activeRegion }) {
  const dispatch = dispatchHook();
  console.log(activeRegion);

  const [isMerchantList, setIsMerchantList] = useState(
    Cookies.get("isMerchantList") === "true" || false
  );
  console.log(isMerchantList);

  // state for the search and modal and pagination
  const [query, setQuery] = useState(" ");
  console.log(query);
  const [showInput, setShowInput] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  console.log(currentPage);
  const [editComplete, setEditComplete] = useState(false);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~ Store ~~~~~~~~~~~~~~~~~~~~
  const user = User();
  const organizationsList = allOrganizations() || [];
  console.log(organizationsList);
  const merchants = allMerchants() || [];
  const couponNumbers = mCoupons() || [];
  const sellerResults = searchedSeller() || [];
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const itemsPerPage = 12;

  const handleToggle = () => {
    const newIsMerchantList = !isMerchantList;
    Cookies.set("isMerchantList", newIsMerchantList, { expires: 365 });
    setIsMerchantList(newIsMerchantList);
  };

  useEffect(() => {
    const initialIsMerchantList =
      Cookies.get("isMerchantList") === "true" || false;
    setIsMerchantList(initialIsMerchantList);
  }, []);

  // useEffect(() => {
  //   // Initial data fetch based on isMerchantList
  //   // const fetchDataAction = isMerchantList
  //   //   ? "FETCH_MERCHANTS"
  //   //   : "FETCH_ORGANIZATIONS";
  //   // dispatch({ type: fetchDataAction });
  //   if (activeRegion.id) {
  //     const fetchDataAction = isMerchantList
  //       ? "FETCH_MERCHANTS"
  //       : "FETCH_ORGANIZATIONS";
  //     dispatch({ type: fetchDataAction, payload: activeRegion.id });
  //   }

  //   const dispatchAction = isMerchantList && "FETCH_COUPON_NUMBER";
  //   dispatch({ type: dispatchAction });

  //   // If editComplete is true, trigger refresh and reset editComplete
  //   // if (editComplete) {
  //   //   dispatch({ type: fetchDataAction });
  //   //   setEditComplete(false);
  //   // }
  // }, [isMerchantList]);

  // useEffect(() => {
  //   // If editComplete is true, trigger refresh and reset editComplete
  //   if (editComplete) {
  //     const fetchDataAction = isMerchantList
  //     ? "FETCH_MERCHANTS"
  //     : "FETCH_ORGANIZATIONS";
  //     dispatch({ type: fetchDataAction, payload: activeRegion.id });
  //     setEditComplete(false);
  //   }
  // }, [editComplete]);
  function fetchAction(isMerchantList, dispatch, activeRegionId) {
    const fetchDataAction = isMerchantList ? "FETCH_MERCHANTS" : "FETCH_ORGANIZATIONS";
    dispatch({ type: fetchDataAction, payload: activeRegionId });
  }
  
  useEffect(() => {
    if (activeRegion.id) {
      fetchAction(isMerchantList, dispatch, activeRegion.id);
    }
  
    const dispatchAction = isMerchantList && "FETCH_COUPON_NUMBER";
    dispatch({ type: dispatchAction });
  
  }, [isMerchantList]);
  
  useEffect(() => {
    // If editComplete is true, trigger refresh and reset editComplete
    if (editComplete) {
      fetchAction(isMerchantList, dispatch, activeRegion.id);
      setEditComplete(false);
    }
  }, [editComplete]);

  // fuzzy search information
  const listToSearch = !isMerchantList ? organizationsList : merchants;
  console.log(listToSearch);
  const keys = !isMerchantList ? ["organization_name"] : ["merchant_name"];
  console.log(keys);

  const fuse = new Fuse(listToSearch, {
    keys: keys,
    includeScore: true,
    threshold: 0.3,
    minMatchCharLength: 2,
  });
  const results = fuse.search(query);
  console.log(results);
  const searchResult = results.map((result) => result.item);
  console.log(searchResult);

  const handleOnSearch = (value) => {
    console.log(value);
    setQuery(value);
    if (!showInput) {
      setShowInput(true);
    }
    setCurrentPage(1); // Reset to the first page when searching
  };

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
      : organizationsList.slice(indexOfFirstItem, indexOfLastItem);

  console.log(currentItems);

  const totalItems =
    searchResult.length > 0
      ? searchResult.length
      : !isMerchantList
      ? organizationsList.length
      : merchants.length;
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEdit = () => {
    setEditComplete(true);
  };

  return (
    <div className="organizationsContainer">
      <Paper elevation={3} style={{ width: "90%", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~ TOGGLE VIEWS ~~~~~~~~~~ */}
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~ User who is orgAdmin ~~~~~ */}
          {isOrgAdmin && !isGraphicDesigner && !user.is_admin && (
            <Box sx={{ flexGrow: 1 }}></Box>
          )}
          {/* ~~~~~ User who is both orgAdmin and Graphic Designer ~~~~~ */}
          {isOrgAdmin && isGraphicDesigner && !user.is_admin && (
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
          {/* ~~~~~ User who is both orgAdmin and Graphic Designer ~~~~~ */}
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
          {/* ~~~~~ Seller Search Drawer ~~~~~ */}
          <SellerSearch sellers={sellerResults} />
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

          {isMerchantList
            ? currentItems.map((merchant, index) => (
                <ListView
                  key={index}
                  data={merchant}
                  isMerchantList={true}
                  onChange={handleEdit}
                  editComplete={editComplete}
                  setEditComplete={setEditComplete}
                  numCoupons={
                    couponNumbers.find(
                      (coupon) => coupon.merchant_id === merchant.id
                    )?.num_coupons || 0
                  }
                  activeRegion={activeRegion}
                />
              ))

            : currentItems
                .filter(
                  (organization) =>
                    !isOrgAdmin ||
                    (orgIdsArray.length > 0 &&
                      orgIdsArray.includes(organization.id))
                )
                .map((organization, index) => {
                  // Check if the user is an admin of this organization
                  const isAdminOfOrganization = orgIdsArray.includes(
                    organization.id
                  );
                  const isAdmin = user.is_admin;

                  // Render the organization only if the user is an admin
                  if (isAdminOfOrganization || isAdmin) {
                    return (
                      <ListView
                        key={organization.id}
                        data={organization}
                        isMerchantList={false}
                        onChange={handleEdit}
                        editComplete={editComplete}
                        setEditComplete={setEditComplete}
                        isOrgAdmin={isOrgAdmin}
                        activeRegion={activeRegion}
                      />
                    );
                  }

                  // Return null if the user is not an admin of this organization
                  // This will prevent the organization from being rendered
                  return null;
                })}
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
