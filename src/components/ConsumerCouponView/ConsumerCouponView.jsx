import { Suspense, useState, useEffect } from "react";
import {
  Box,
  useMediaQuery,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
// ~~~~~~~~~~ Utils ~~~~~~~~~~ //
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
import ListWithSeasonLabel from "./ListWithSeasonLabel";
import LoadingSpinner from "../HomePage/LoadingSpinner";
import RedeemedList from "./RedeemedList";
import SearchBar from "../SearchBar/SearchBar";
import ToggleButton from "../ToggleButton/ToggleButton";

export default function ConsumerCouponView() {
  const dispatch = dispatchHook();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isLoading, setIsLoading] = useState(true);
  const [viewRedeemed, setViewRedeemed] = useState(false);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Store - reducers
  const user = User();
  // May switch the store for coupons, as userCoupons is returning unredeemed, and redeemed states
  const coupons = couponsData() || []; // Returning URLs, not Pdfs
  const userCoupons = userBooksData() || []; // Returning URLs, not Pdfs
  // console.log("userCoupons", userCoupons);
  // Select redeemed coupons from reducer
  const redeemedCoupons = userCoupons?.redeemed;

  // For Coupon Book Year
  const activeYearObj = appActiveYear();
  // Year ID
  const activeYearId =
    activeYearObj && activeYearObj[0] ? activeYearObj[0].id : "";
  // Get year string
  const nextSeasonYear =
    activeYearObj.length > 1 ? activeYearObj[1].year.split("-")[1] : "";
  // Exp year string
  const expirationYear =
    activeYearObj && activeYearObj[0]
      ? activeYearObj[0].year.split("-")[1]
      : "";
  // Active year ID(s) array
  const activeYearIds = activeYearObj
    ? activeYearObj.filter((y) => y.active).map((y) => y.id)
    : [];

  // Connects to userCoupon router
  useEffect(() => {
    const dispatchAction = {
      type: "FETCH_CONSUMER_COUPONS",
      payload: {
        userId: user.id,
        yearIds: activeYearIds,
      },
    };
    dispatch(dispatchAction);
  }, [activeYearObj]); // Removed currentPage from the dependency array

  // Fetch redeemed coupons when component mounts
  useEffect(() => {
    const dispatchAction = {
      type: "FETCH_REDEEMED_COUPONS",
      payload: { userId: user?.id, yearId: activeYearId }, // replace with real values
    };
    dispatch(dispatchAction);
  }, [activeYearObj]);

  useEffect(() => {
    if (coupons.length > 0) {
      setIsLoading(false);
    }
  }, [coupons]);

  const handleToggle = () => {
    setViewRedeemed(!viewRedeemed);
    setCurrentPage(1); // Reset to the first page when toggling view
  };

  const handleSearch = (value) => {
    setQuery(value);
  };

  // Decide which list to paginate based on toggle
  const activeList = viewRedeemed
    ? redeemedCoupons || [] // redeemed coupons --> in userCoupons
    : coupons || []; // normal coupons

  // Filter coupons by merchant name
  const filteredMerchants = activeList.filter(
    (coupon) =>
      typeof coupon.merchantName === "string" &&
      coupon.merchantName.toLowerCase().includes(query.toLowerCase())
  );

  const totalFilteredMerchants =
    query.trim() === ""
      ? viewRedeemed
        ? filteredMerchants.length
        : coupons.length // pick based on view
      : filteredMerchants.length;

  const clearInput = () => {
    setQuery("");
    // setShowInput(false);
    setCurrentPage(1); // Reset to the first page when clearing the search
  };

  // Helper to get year from activeYearObj
  const getCouponYear = (coupon) => {
    const book = activeYearObj.find((y) => y.id === coupon.bookId);
    return book ? book.year : null;
  };

  const couponsPerPage = isMobile ? 5 : 10;
  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = filteredMerchants.slice(
    indexOfFirstCoupon,
    indexOfLastCoupon
  );

  const startIdx = (currentPage - 1) * couponsPerPage;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Removed prepare coupons with complete URLs - changed structure of formatCoupons() in helpers instead

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
            label={viewRedeemed ? "Redeemed Coupons" : "My Coupons"}
            variant="h5"
            sx={{ mt: 2, fontWeight: "bold", ...centerMe }}
          />
          {!viewRedeemed && (
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
        }}
      >
        <Stack
          gap={1}
          direction={isMobile ? "column" : "row"}
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ Search Bar ~~~~~~~~~~ */}
          {viewRedeemed && isMobile ? null : (
            <SearchBar
              isMobile={isMobile}
              isCoupon
              isOrganization={false}
              query={query}
              onChange={handleSearch}
              clearInput={clearInput}
              disabled={viewRedeemed}
            />
          )}
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~ Toggle ~~~~~~~~~~ */}
          <ToggleButton
            sxButton={{ margin: 0, whiteSpace: "nowrap" }}
            onClick={() => handleToggle(!viewRedeemed)}
            label1="View Redeemed"
            label2="View Active"
            toggleState={viewRedeemed}
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
            waitingText="Please wait while we load your coupons..."
            finalText="Oops! ...unexpected error. Please refresh the page, or try again later"
            timeout={15000}
          />
        ) : viewRedeemed ? (
          <RedeemedList redeemedCoupons={currentCoupons} />
        ) : currentCoupons.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              height: "50vh",
              width: "50vw",
            }}
          >
            <Typography variant="subtitle1" color="text.secondary">
              No coupons found
            </Typography>
          </Box>
        ) : (
          <ListWithSeasonLabel
            coupons={currentCoupons}
            isMobile={isMobile}
            nextSeasonYear={nextSeasonYear}
            getCouponYear={getCouponYear}
            startIdx={startIdx}
          />
        )}
      </Suspense>

      {/* ~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~ Pagination ~~~~~ */}
      {currentCoupons.length > 0 && (
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
