import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Paper,
  Pagination,
  Typography,
  Fab,
  Tooltip,
} from "@mui/material";
import "./HomePage.css";
import Fuse from "fuse.js";
import SearchIcon from "@mui/icons-material/Search";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import AddBoxIcon from "@mui/icons-material/AddBox";
// ~~~~~~~~~~ Components ~~~~~~~~~~~~~~
import AddAccountModal from "../AddAccountModal/AddAccountModal.jsx";
import ListView from "../ListView/ListView.jsx";
import SearchBar from "../SearchBar/SearchBar.jsx";
import ToggleButton from "../ToggleButton/ToggleButton.jsx";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { allMerchants, mCoupons } from "../../hooks/reduxStore.js";
import { border } from "../Utils/colors.js";
import { buttonIconSpacing } from "../Utils/helpers.js";

function HomePage({ isOrgAdmin, isGraphicDesigner }) {
  console.log(isOrgAdmin);
  console.log(isGraphicDesigner);
  const dispatch = useDispatch();
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~ Store ~~~~~~~~~~~~~~~~~~~~

  const auth = useSelector((store) => store.auth)
  const user = useSelector((store) => store.user)
  useEffect(() => {
    console.log('Dispatching data fetch action...');
    dispatch({ type: "FETCH_ORGANIZATIONS", payload: auth })
    dispatch({ type: "FETCH_MERCHANTS", payload: auth })
  }, [auth]);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [isMerchantList, setIsMerchantList] = useState(
    isGraphicDesigner ? true : false
  );
  console.log(isMerchantList);
  const organizationsList = useSelector((store) => store.organizations);
  console.log(organizationsList);
  const merchants = allMerchants() || [];
  console.log(merchants);
  // state for the search and modal and pagination
  const [query, setQuery] = useState(" ");
  console.log(query);
  const [showInput, setShowInput] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  console.log(currentPage);
  const [editComplete, setEditComplete] = useState(false);
  console.log(editComplete);
  const itemsPerPage = 12;


  //   // Initial data fetch based on isMerchantList
  //   const fetchDataAction = isMerchantList
  //     ? "FETCH_MERCHANTS"
  //     : "FETCH_ORGANIZATIONS";
  //   dispatch({ type: fetchDataAction, payload: auth });
  // };

  useEffect(() => {
    const dispatchAction = isMerchantList && "FETCH_COUPON_NUMBER";
    dispatch({ type: dispatchAction, payload: auth });

    // If editComplete is true, trigger refresh and reset editComplete
    if (editComplete) {
      dispatch({ type: fetchDataAction, payload: auth });
      setEditComplete(false);
    }
  }, [isMerchantList, editComplete]);

  const couponNumbers = mCoupons() || [];
  console.log(couponNumbers);


  

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
        : organizationsList?.organization?.slice(indexOfFirstItem, indexOfLastItem) || [];


  console.log(currentItems);

  const totalItems =
    searchResult.length > 0
      ? searchResult.length
      : !isMerchantList
        ? organizationsList?.organization?.length || 0
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
        console.log(coupon)
        if (merchant.id == coupon.merchant_id) {
          console.log("Merchant ID:", merchant.id, "Coupon Merchant ID:", coupon.merchant_id);
          couponCount.push({
            merchant: merchant.id,
            count: coupon.count
          });
        }
      }
    }
    return couponCount;
  }

  const couponCount = createCouponCount(merchants, couponNumbers);
  console.log(couponCount)

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
              // onClick={() => setIsMerchantList(!isMerchantList)}
              title="Toggle List View"
              onClick={() => setIsMerchantList((prevState) => !prevState)}
              label1="Merchants"
              label2="Organizations"
              toggleState={isMerchantList}
            />
          )}
          {isOrgAdmin && isGraphicDesigner && (
            <ToggleButton
              sxButton={{ margin: 2 }}
              sxIcon={{ mr: 1 }}
              // onClick={() => setIsMerchantList(!isMerchantList)}
              title="Toggle List View"
              onClick={() => setIsMerchantList((prevState) => !prevState)}
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

          {
            isMerchantList
              ? currentItems.map((merchant, index) => (
                <ListView
                  key={index}
                  data={merchant}
                  isMerchantList={true}
                  onChange={handleEdit}
                  editComplete={editComplete}
                  setEditComplete={setEditComplete}
                  numCoupons={
                    couponCount || 0
                  }
                />
              ))
              : currentItems.map((organization, index) => (
                <ListView
                  key={index}
                  data={organization}
                  isMerchantList={false}
                  onChange={handleEdit}
                  editComplete={editComplete}
                  setEditComplete={setEditComplete}
                  isOrgAdmin={isOrgAdmin}
                />
              ))
            // <div>Not Merchant List</div>
          }
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
