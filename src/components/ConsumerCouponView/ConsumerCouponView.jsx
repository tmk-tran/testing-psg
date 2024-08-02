import React, { useState, useEffect } from "react";
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
import { User, couponsData, appActiveYear } from "../../hooks/reduxStore";
// ~~~~~~~~~~ Components ~~~~~~~~~ //
import Typography from "../Typography/Typography";
import CouponCard from "./CouponCard";
import SearchBar from "../SearchBar/SearchBar";
import ToggleButton from "../ToggleButton/ToggleButton";

export default function ConsumerCouponView() {
  const dispatch = dispatchHook();
  const user = User();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [toggleView, setToggleView] = useState(false);
  console.log(toggleView);
  const [query, setQuery] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const coupons = couponsData() || [];
  // For Coupon Book Year
  const activeYear = bookYear();
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
  }, [activeYear]);

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

  const couponsPerPage = 10;
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
          {currentCoupons.length > 0 ? (
            currentCoupons.map((coupon, index) => (
              <CouponCard isMobile={isMobile} key={index} coupon={coupon} />
            ))
          ) : (
            <Typography label="No matching coupons found" />
          )}
        </>
      ) : (
        <Typography label="Coupons Redeemed" />
      )}
      {/* ~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~ Pagination ~~~~~ */}
      <Pagination
        count={Math.ceil(totalFilteredMerchants / couponsPerPage)}
        page={currentPage}
        onChange={(event, page) => paginate(page)}
        color="primary"
      />
    </Box>
  );
}
