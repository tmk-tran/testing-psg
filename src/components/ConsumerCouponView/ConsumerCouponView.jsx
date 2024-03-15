import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { Box } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { border } from "../Utils/colors";
import {
  containerStyle,
  centeredStyle,
  centerMe,
  flexRowSpace,
} from "../Utils/pageStyles";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { dispatchHook } from "../../hooks/useDispatch";
import { couponsData } from "../../hooks/reduxStore";
// ~~~~~~~~~~ Components ~~~~~~~~~ //
import Typography from "../Typography/Typography";
import CouponCard from "./CouponCard";
import SearchBar from "../SearchBar/SearchBar";
import ToggleButton from "../ToggleButton/ToggleButton";

export default function ConsumerCouponView() {
  const dispatch = dispatchHook();
  const [toggleView, setToggleView] = useState(false);
  console.log(toggleView);
  const [query, setQuery] = useState("");
  console.log(query);
  const [filteredCoupons, setFilteredCoupons] = useState([]);

  useEffect(() => {
    const dispatchAction = {
      type: "FETCH_COUPON_FILES",
    };
    dispatch(dispatchAction);
  }, []);

  const coupons = couponsData() || [];
  console.log(coupons);

  const fuse = new Fuse(coupons, {
    keys: ["merchantName"], // The 'merchant' field is used for searching
    includeScore: true,
    threshold: 0.3, // Adjust the threshold for fuzzy search accuracy
  });

  const handleToggle = () => {
    setToggleView(!toggleView);
  };

  // const handleSearch = (value) => {
  //   setQuery(value);
  //   if (value.trim() === "") {
  //     setFilteredCoupons([]);
  //   } else {
  //     const results = fuse.search(value);
  //     setFilteredCoupons(results.map((result) => result.item));
  //   }
  // };  

  const handleSearch = (value) => {
    setQuery(value);
    if (value.trim() === "") {
      setFilteredCoupons([]);
    } else {
      const results = fuse.search(value);
      setFilteredCoupons(results.map((result) => result.item));
    }
  };
  
  // Filter coupons by merchant name
  const filteredMerchants = coupons.filter(
    (coupon) =>
      coupon.merchantName.toLowerCase().includes(query.toLowerCase())
  );
  

  const clearInput = () => {
    setQuery("");
    // setShowInput(false);
    // setCurrentPage(1); // Reset to the first page when clearing the search
  };

  return (
    <Box
      sx={{
        ...centeredStyle,
        ...border,
        ...containerStyle,
        position: "relative",
      }}
    >
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~ Toggle ~~~~~~~~~~ */}
      <Box sx={{ position: "absolute", top: 0, left: 0 }}>
        <ToggleButton
          sxButton={{ margin: 2 }}
          sxIcon={{ mr: 1 }}
          onClick={() => handleToggle(!toggleView)}
          label1="View Redeemed"
          label2="View Active"
          toggleState={toggleView}
        />
      </Box>
      {/* ~~~~~~~~~~ Header ~~~~~~~~~~ */}
      <Typography
        label={toggleView ? "Redeemed Coupons" : "My Coupons"}
        variant="h5"
        sx={{ mt: 2, fontWeight: "bold", ...centerMe }}
      />
      <br />
      {!toggleView ? (
        <>
          <Box sx={{ mb: 2, width: "75%", ...flexRowSpace }}>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            {/* ~~~~~~~~~~ Search Bar ~~~~~~~~~~ */}
            <SearchBar
              isCoupon
              isOrganization={false}
              query={query}
              onChange={handleSearch}
              clearInput={clearInput}
            />
            <Typography
              label="Coupons valid mm/dd/yy - mm/dd/yy"
              variant="body2"
              sx={{ mt: 2 }}
            />
          </Box>
          {filteredMerchants.length > 0 ? (
            filteredMerchants.map((coupon, i) => (
              <CouponCard key={i} coupon={coupon} />
            ))
          ) : (
            <Typography label="No matching coupons found" />
          )}

          {/* {coupons ? (
            coupons.map((coupon, i) => <CouponCard key={i} coupon={coupon} />)
          ) : (
            <Typography label="Coupons unavailable" />
          )} */}
        </>
      ) : (
        <Typography label="Coupons Redeemed" />
      )}
    </Box>
  );
}
