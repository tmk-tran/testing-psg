import React, { lazy, Suspense, useState, useEffect } from "react";
import Fuse from "fuse.js";
import { Box, useMediaQuery, Pagination } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import {
  containerStyle,
  centeredStyle,
  centerMe,
  flexRowSpace,
  flexColumn,
} from "../Utils/pageStyles";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { dispatchHook } from "../../hooks/useDispatch";
import {
  User,
  couponsData,
  appActiveYear,
} from "../../hooks/reduxStore";
// ~~~~~~~~~~ Components ~~~~~~~~~ //
import Typography from "../Typography/Typography";
// import CouponCard from "./CouponCard";
import SearchBar from "../SearchBar/SearchBar";
import ToggleButton from "../ToggleButton/ToggleButton";
import LoadingSpinner from "../HomePage/LoadingSpinner";

const CouponCard = lazy(() => import("./CouponCard"));

export default function ConsumerCouponView() {
  const dispatch = dispatchHook();
  const user = User();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState(true);
  const [toggleView, setToggleView] = useState(false);
  console.log(toggleView);
  const [query, setQuery] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const coupons = couponsData() || [];
  console.log(coupons);
  // For PDF solution
  // const baseURL = "https://fly.storage.tigris.dev/coupons/"; // in PROD, for the preparedCoupons variable below
  // For Coupon Book Year
  const activeYear = appActiveYear();
  const expirationYear =
    activeYear && activeYear[0] ? activeYear[0].year.split("-")[1] : "";
  // Year ID //
  const activeYearId = activeYear && activeYear[0] ? activeYear[0].id : "";

  useEffect(() => {
    const dispatchAction = {
      type: "FETCH_CONSUMER_COUPONS",
      payload: {
        userId: user.id,
        yearId: activeYearId,
      },
    };
    dispatch(dispatchAction);
  }, [activeYear]); // Removed currentPage from the dependency array

  const fuse = new Fuse(coupons, {
    keys: ["merchant_name"], // The 'merchant' field is used for searching
    includeScore: true,
    threshold: 0.3, // Adjust the threshold for fuzzy search accuracy
  });

  const handleToggle = () => {
    setToggleView(!toggleView);
  };

  const handleSearch = (value) => {
    setQuery(value);
    if (value.trim() === "") {
      setFilteredCoupons([]);
    } else {
      const results = fuse.search(value);
      setFilteredCoupons(results.map((result) => result.item));
    }
  };

  // // Filter coupons by merchant name
  const filteredMerchants = coupons.filter(
    (coupon) =>
      typeof coupon.merchantName === "string" &&
      coupon.merchantName.toLowerCase().includes(query.toLowerCase())
  );
  console.log(filteredMerchants);

  const clearInput = () => {
    setQuery("");
    // setShowInput(false);
    // setCurrentPage(1); // Reset to the first page when clearing the search
  };

  const couponsPerPage = isMobile ? 5 : 10;
  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = filteredMerchants.slice(
    indexOfFirstCoupon,
    indexOfLastCoupon
  );
  const totalFilteredMerchants =
    query.trim() === "" ? coupons.length : filteredMerchants.length;
  console.log(totalFilteredMerchants);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Prepare coupons with complete URLs - in PROD
  // const preparedCoupons = currentCoupons.map((coupon) => ({
  //   ...coupon,
  //   backViewUrl: coupon.backViewUrl ? `${baseURL}${coupon.backViewUrl}` : null,
  //   frontViewUrl: coupon.frontViewUrl
  //     ? `${baseURL}${coupon.frontViewUrl}`
  //     : null,
  // }));

  return (
    <Box
      sx={{
        ...centeredStyle,
        // ...containerStyle,
        ...(isMobile ? {} : containerStyle),
        position: "relative",
      }}
    >
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~ Toggle ~~~~~~~~~~ */}
      <Box sx={{ position: "absolute", top: 0, left: 0 }}>
        {/* <ToggleButton
          sxButton={{ margin: 2 }}
          sxIcon={{ mr: 1 }}
          onClick={() => handleToggle(!toggleView)}
          label1="View Redeemed"
          label2="View Active"
          toggleState={toggleView}
        /> */}
      </Box>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ Header ~~~~~~~~~~ */}
      <Typography
        label={toggleView ? "Redeemed Coupons" : "My Coupons"}
        variant="h5"
        sx={{ mt: isMobile ? 0 : 2, fontWeight: "bold", ...centerMe }}
      />
      <br />
      {!toggleView ? (
        <>
          <Box
            sx={{
              mb: 2,
              width: isMobile ? "100%" : "75%",
              ...(isMobile ? flexColumn : flexRowSpace),
            }}
          >
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~ Search Bar ~~~~~~~~~~ */}
            <SearchBar
              isMobile={isMobile}
              isCoupon
              isOrganization={false}
              query={query}
              onChange={handleSearch}
              clearInput={clearInput}
            />
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~ Valid through ~~~~~~ */}
            <Typography
              label={`Valid through September 1st, ${expirationYear}`}
              variant={isMobile ? "caption" : "body2"}
              sx={{ mt: 2, textAlign: "center" }}
            />
          </Box>
          {/* ~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~ List ~~~~~ */}
          {/* {isLoading && (
            <LoadingSpinner
              text="Loading from database..."
              waitingText="Please wait while we load image files..."
              finalText="Oops! ...unexpected error. Please refresh the page, or try again later"
              timeout={15000}
            />
          )}
          {!isLoading && (
            <Suspense fallback={<LoadingSpinner text="Loading Coupons..." />}>
              {currentCoupons.map((coupon, index) => (
              {preparedCoupons.map((coupon, index) => (
                <CouponCard isMobile={isMobile} key={index} coupon={coupon} />
              ))}
            </Suspense>
          )} */}
          <Suspense fallback={<LoadingSpinner text="Loading Coupons..." />}>
            {isLoading ? (
              <LoadingSpinner
                text="Loading..."
                waitingText="Please wait while we load image files..."
                finalText="Oops! ...unexpected error. Please refresh the page, or try again later"
                timeout={15000}
              />
            ) : (
              currentCoupons.map((coupon, index) => (
                <CouponCard isMobile={isMobile} key={index} coupon={coupon} />
              ))
            )}
          </Suspense>
        </>
      ) : (
        <Typography label="Coupons Redeemed" />
      )}
      {/* ~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~ Pagination ~~~~~ */}
      <Pagination
        // count={Math.ceil(totalFilteredMerchants / couponsPerPage)}
        count={100}
        page={currentPage}
        onChange={(event, page) => paginate(page)}
        color="primary"
        sx={{
          "& .MuiPagination-ul": {
            flexWrap: "nowrap", // Prevent wrapping of pagination items
          },
          "& .MuiPaginationItem-previousNext svg": {
            fontSize: { xs: "3rem", sm: "3.5rem" }, // Increase icon size for arrows
          },
        }}
      />
    </Box>
  );
}
