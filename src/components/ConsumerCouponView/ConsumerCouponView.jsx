import { lazy, Suspense, useState, useEffect } from "react";
import {
  Box,
  useMediaQuery,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
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
  userBooksData,
} from "../../hooks/reduxStore";
// ~~~~~~~~~~ Components ~~~~~~~~~ //
import CustomTypography from "../Typography/Typography";
import SearchBar from "../SearchBar/SearchBar";
import ToggleButton from "../ToggleButton/ToggleButton";
import LoadingSpinner from "../HomePage/LoadingSpinner";
import RedeemedList from "./RedeemedList";

const CouponCard = lazy(() => import("./CouponCard"));

export default function ConsumerCouponView() {
  const dispatch = dispatchHook();
  const user = User();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isLoading, setIsLoading] = useState(true);
  const [toggleView, setToggleView] = useState(false);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // May switch the store for coupons, as userCoupons is returning unredeemed, and redeemed states
  const coupons = couponsData() || []; // Returning URLs, not Pdfs
  const userCoupons = userBooksData() || []; // Returning URLs, not Pdfs
  // For PDF solution
  const baseURL = "https://fly.storage.tigris.dev/coupons/"; // in PROD, for the preparedCoupons variable below
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

  useEffect(() => {
    if (coupons.length > 0) {
      setIsLoading(false);
    }
  }, [coupons]);

  const handleToggle = () => {
    setToggleView(!toggleView);
    setCurrentPage(1); // Reset to the first page when toggling view
  };

  const handleSearch = (value) => {
    setQuery(value);
  };

  // Decide which list to paginate based on toggle
  const activeList = toggleView
    ? userCoupons?.redeemed || [] // redeemed coupons from store
    : coupons || []; // normal coupons

  // Filter coupons by merchant name
  const filteredMerchants = activeList.filter(
    (coupon) =>
      typeof coupon.merchantName === "string" &&
      coupon.merchantName.toLowerCase().includes(query.toLowerCase())
  );

  const totalFilteredMerchants =
    query.trim() === ""
      ? toggleView
        ? filteredMerchants.length
        : coupons.length // pick based on view
      : filteredMerchants.length;

  const clearInput = () => {
    setQuery("");
    // setShowInput(false);
    setCurrentPage(1); // Reset to the first page when clearing the search
  };

  // TODO: Fix pagination count logic for redeemed list
  const couponsPerPage = isMobile ? 5 : 10;
  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = filteredMerchants.slice(
    indexOfFirstCoupon,
    indexOfLastCoupon
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Prepare coupons with complete URLs - in PROD
  const preparedCoupons = currentCoupons.map((coupon) => ({
    ...coupon,
    backViewUrl: coupon.backViewUrl ? `${baseURL}${coupon.backViewUrl}` : null,
    frontViewUrl: coupon.frontViewUrl
      ? `${baseURL}${coupon.frontViewUrl}`
      : null,
  }));

  return (
    <Box
      sx={{
        ...centeredStyle,
        ...(isMobile ? {} : containerStyle),
        position: "relative",
      }}
    >
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ Header ~~~~~~~~~~ */}
      {!isMobile && (
        <>
          <CustomTypography
            label={toggleView ? "Redeemed Coupons" : "My Coupons"}
            variant="h5"
            sx={{ mt: 2, fontWeight: "bold", ...centerMe }}
          />
          {!toggleView && (
            <CustomTypography
              label={`Valid through September 1st, ${expirationYear}`}
              variant="subtitle2"
              sx={{ textAlign: "center" }}
            />
          )}
        </>
      )}

      {/* Content */}
      {/* Always show search + toggle */}
      <Box
        sx={{
          mb: 2,
          width: isMobile ? "100%" : "75%", //set fixed width here
          ...(isMobile ? flexColumn : flexRowSpace),
          // border: "1px solid red",
        }}
      >
        <Stack
          gap={1}
          direction={isMobile ? "column" : "row"}
          justifyContent="space-between"
          // marginX={4}
          sx={{ width: "100%" }}
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
            disabled={toggleView}
          />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~ Toggle ~~~~~~~~~~ */}
          <ToggleButton
            sxButton={{ margin: 0, whiteSpace: "nowrap" }}
            onClick={() => handleToggle(!toggleView)}
            label1="View Redeemed"
            label2="View Active"
            toggleState={toggleView}
          />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~ Valid through ~~~~~~ */}
          {isMobile && (
            <Typography
              label={`Valid through September 1st, ${expirationYear}`}
              variant={"caption"}
              sx={{ textAlign: "center" }}
            />
          )}
        </Stack>
      </Box>

      {/* Render list based on toggle */}
      <Suspense fallback={<LoadingSpinner text="Loading Coupons..." />}>
        {isLoading ? (
          <LoadingSpinner
            text="Loading..."
            waitingText="Please wait while we load image files..."
            finalText="Oops! ...unexpected error. Please refresh the page, or try again later"
            timeout={15000}
          />
        ) : toggleView ? (
          <RedeemedList />
        ) : preparedCoupons.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              // border: "1px solid red",
              height: "50vh",
              width: "50vw",
            }}
          >
            <Typography variant="subtitle1" color="text.secondary">
              No coupons found
            </Typography>
          </Box>
        ) : (
          preparedCoupons.map((coupon, index) => (
            <CouponCard isMobile={isMobile} key={index} coupon={coupon} />
          ))
        )}
      </Suspense>

      {/* ~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~ Pagination ~~~~~ */}
      {preparedCoupons.length > 0 && (
        <Pagination
          count={Math.ceil(totalFilteredMerchants / couponsPerPage)}
          page={currentPage}
          onChange={(event, page) => paginate(page)}
          color="primary"
          sx={{
            "& .MuiPagination-ul": {
              flexWrap: "nowrap",
            },
            "& .MuiPaginationItem-previousNext svg": {
              fontSize: { xs: "3rem", sm: "3.5rem" },
            },
          }}
        />
      )}
    </Box>
  );
}
