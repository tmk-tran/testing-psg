import React, { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Cookies from "js-cookie";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import UserProfile from "../UserProfile/UserProfile";
import HomePage from "../HomePage/HomePage";
import Details from "../Details/Details";
import LandingPage from "../LandingPage/LandingPage";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import GroupDetails from "../GroupDetails/GroupDetails";
import MenuLinks from "../MenuLinks/MenuLinks";
import ArchivedOrganizations from "../ArchivedOrganizations/ArchivedOrganizations";
import GlobalFundraiserInput from "../GlobalFundraiserInput/GlobalFundraiserInput";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import TaskTabs from "../TaskTabs/TaskTabs";
import CouponReviewDetails from "../CouponReviewDetails/CouponReviewDetails";
import CheckoutPage from "../CheckoutPage/CheckoutPage";
import OrderPage from "../CheckoutPage/OrderPage";
import OrgSellers from "../OrgSellers/OrgSellers";
import ShoppingCart from "../CheckoutPage/ShoppingCart";
import ConsumerCouponView from "../ConsumerCouponView/ConsumerCouponView";
import SellerLandingPage from "../SellerPage/SellerLandingPage";
import OrderComplete from "../CheckoutPage/OrderComplete";
import Transactions from "../Transactions/Transactions";
import MerchantDetails from "../Details/MerchantDetails";
import UserAdmin from "../UserAdmin/UserAdmin";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { dispatchHook } from "../../hooks/useDispatch";
import { Region, User } from "../../hooks/reduxStore";
import { getCurrentSeason } from "../Utils/helpers";

// ~~~~~ Theme establishing global color for MUI ~~~~~
const theme = createTheme({
  typography: {
    fontSize: 18,
    fontFamily: "'Nunito', Helvetica, sans-serif",
  },
  palette: {
    primary: {
      // main: "#273b91", // Set to PSG brand blue
      main: "#19338E",
    },
    secondary: {
      main: "#198E19",
    },
  },
});
// ~~~~~ end theme ~~~~~

function App() {
  const dispatch = dispatchHook();
  const user = User();
  const allRegions = Region() || [];
  console.log(allRegions);
  const activeRegion = allRegions
    ? allRegions.find((region) => region.active)
    : null;
  console.log(activeRegion);

  const [orgAdminId, setOrgAdminId] = useState(null);
  const [activeRegionName, setActiveRegionName] = useState(null);
  console.log(activeRegionName);

  useEffect(() => {
    const userCookie = Cookies.get('user');

    if (userCookie) {
      // Set user in Redux state
      // dispatch({ type: 'SET_USER', payload: JSON.parse(userCookie) });
      dispatch({ type: "FETCH_USER" });
    }
  }, [dispatch]);

  useEffect(() => {
    // Set the current season
    const currentSeason = getCurrentSeason();

    const dispatchAction2 = {
      type: "FETCH_BOOK_YEAR",
    };
    console.log(dispatchAction2);
    dispatch(dispatchAction2);
  }, []);

  useEffect(() => {
    // Get the Regions available to the user
    const dispatchAction = {
      type: "FETCH_REGIONS",
    };
    dispatch(dispatchAction);
  }, []);

  useEffect(() => {
    // Set the active region name, convert to lowercase, and remove spaces
    setActiveRegionName(
      activeRegion
        ? activeRegion.region_name.toLowerCase().replace(/\s+/g, "")
        : null
    );
  }, [activeRegion]);
  console.log(activeRegionName);

  useEffect(() => {
    // Get the Regions available to the user
    const dispatchAction = {
      type: "FETCH_REGIONS",
    };
    console.log(dispatchAction);
    dispatch(dispatchAction);
  }, []);

  // useEffect(() => {
  //   if (region.active)
  // }, []);

  useEffect(() => {
    if (user.org_admin) {
      setOrgAdminId(user.org_id);
    }
    return () => {
      // Cleanup function to reset orgAdminId to null when component unmounts
      setOrgAdminId(null);
    };
  }, [user.org_id]);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "92vh",
          }}
        >
          {/* ~~~~~ Header ~~~~~ */}
          <Header user={user} activeRegionName={activeRegionName} />
          <div style={{ flex: "1 0 auto", padding: "20px" }}>
            {user.is_admin || user.org_admin || user.graphic_designer ? (
              <MenuLinks />
            ) : null}
            <Switch>
              {/* ~~~~~ Fargo Home Route ~~~~~ */}
              {/* <Redirect exact from="/" to={`/${activeRegionName}/home`} /> */}
              {activeRegionName && (
  <Redirect exact from="/" to={`/${activeRegionName}/home`} />
)}

              {/* <ProtectedRoute exact path="/fargo/home"> */}
              {activeRegionName && (
              <ProtectedRoute exact path={`/${activeRegionName}/home`}>
                {user.is_admin && <HomePage activeRegion={activeRegion} />}
                {/* {user.org_admin && <HomePage isOrgAdmin={true} />} */}
                {user.org_admin && user.graphic_designer && (
                  <HomePage
                    isOrgAdmin={true}
                    orgAdminId={orgAdminId}
                    isGraphicDesigner={true}
                    activeRegion={activeRegion}
                  />
                )}
                {/* {!user.org_admin && !user.graphic_designer && (
                  <HomePage isOrgAdmin={false} />
                )} */}
                {user.org_admin && !user.graphic_designer && (
                  <HomePage
                    isOrgAdmin={true}
                    orgAdminId={orgAdminId}
                    activeRegion={activeRegion}
                  />
                )}
                {/* {user.graphic_designer && <HomePage isGraphicDesigner={true} />} */}
                {!user.org_admin && user.graphic_designer && (
                  <HomePage
                    isGraphicDesigner={true}
                    activeRegion={activeRegion}
                  />
                )}
                {!user.is_admin &&
                  !user.org_admin &&
                  !user.graphic_designer && <Redirect to={`/${activeRegionName}/coupon`} />}
              </ProtectedRoute>
              )}

              <ProtectedRoute exact path="/userProfile/:id">
                <UserProfile />
              </ProtectedRoute>

              {user.is_admin && (
                <ProtectedRoute exact path={`/${activeRegionName}/newFundraiser`}>
                  <GlobalFundraiserInput activeRegion={activeRegion} />
                </ProtectedRoute>
              )}

              {user.is_admin && (
                <ProtectedRoute exact path={`/${activeRegionName}/archivedOrganizations`}>
                  <ArchivedOrganizations activeRegion={activeRegion} />
                </ProtectedRoute>
              )}

              <ProtectedRoute exact path="/group/:id">
                <GroupDetails user={user} />
              </ProtectedRoute>

              <ProtectedRoute exact path={`/${activeRegionName}/coupon`}>
                <ConsumerCouponView />
              </ProtectedRoute>

              {(user.is_admin || user.graphic_designer) && (
                <ProtectedRoute exact path={`/fargo/tasks`}>
                  <TaskTabs activeRegion={activeRegion} />
                </ProtectedRoute>
              )}

              {user.is_admin && (
                <ProtectedRoute exact path="/fargo/transactions">
                  <Transactions />
                </ProtectedRoute>
              )}

              {/* ProtectedRoute for /tasks with dynamic tab parameter */}
              <ProtectedRoute path="/tasks/:tab" component={TaskTabs} />

              <ProtectedRoute exact path="/fargo/orgDetails/:id">
                {!user.org_admin ? (
                  <Details
                    isMerchantTaskPage={false}
                    isTaskPage={false}
                    isMerchantDetails={false}
                    isOrgAdminPage={false}
                  />
                ) : (
                  <Details
                    isMerchantTaskPage={false}
                    isTaskPage={false}
                    isMerchantDetails={false}
                    isOrgAdminPage={true}
                  />
                )}
              </ProtectedRoute>

              {/* UPDATE THIS WITH CORRECT ID IN OrgTaskDetails */}
              <ProtectedRoute exact path="/fargo/organizationTaskDetails/:id">
                <Details
                  isMerchantTaskPage={false}
                  isTaskPage={true}
                  isMerchantDetails={false}
                />
              </ProtectedRoute>

              {/* UPDATE THIS WITH CORRECT ID IN MerchantTaskDetails */}
              <ProtectedRoute exact path="/fargo/merchantTaskDetails/:id">
                {/* <Details
                  isMerchantTaskPage={true}
                  isTaskPage={false}
                  isMerchantDetails={true}
                  isOrgAdminPage={false}
                /> */}
                <MerchantDetails
                  isMerchantTaskPage={true}
                  isMerchantDetails={true}
                />
              </ProtectedRoute>

              {/* <ProtectedRoute exact path="/coupon/:id"> */}
              <ProtectedRoute exact path="/fargo/coupon/:merchantId/:couponId">
                <CouponReviewDetails />
              </ProtectedRoute>

              <ProtectedRoute exact path="/fargo/useradmin">
                {user.is_admin ? <UserAdmin /> : <Redirect to="/fargo/home" />}
              </ProtectedRoute>

              <ProtectedRoute exact path="/fargo/sellers">
                <OrgSellers />
              </ProtectedRoute>

              <Route exact path="/seller/:refId/">
                {/* <OrderPage /> */}
                <SellerLandingPage />
              </Route>
              {/* ~~~~~~~~~~ CASH PAGE ~~~~~~~~~~ */}
              <Route exact path="/seller/:refId/cash">
                <OrderPage caseType="cash" />
                {/* <SellerLandingPage /> */}
              </Route>

              <Route exact path="/seller/:refId/cash/cart">
                <ShoppingCart caseType="cash" />
              </Route>
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~ PAYPAL PAGE ~~~~~~~~ */}
              <Route exact path="/seller/:refId/paypal">
                <OrderPage caseType="paypal" />
              </Route>

              <Route exact path="/seller/:refId/paypal/cart">
                <ShoppingCart />
              </Route>
              {/* ~~~~~~~~~~ CHECKOUT PAGE ~~~~~~~~~ */}
              <Route exact path="/seller/:refId/paypal/checkout">
                <CheckoutPage caseType="credit" />
              </Route>
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~ CREDIT PAGE ~~~~~~~~~~~ */}
              <Route exact path="/seller/:refId/credit">
                <OrderPage caseType="credit" />
              </Route>

              <Route exact path="/seller/:refId/credit/cart">
                <ShoppingCart />
              </Route>
              {/* ~~~~~~~~~~ CHECKOUT PAGE ~~~~~~~~~ */}
              <Route exact path="/seller/:refId/credit/checkout">
                <CheckoutPage caseType="credit" />
              </Route>
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~ ORDER COMPLETE PAGE ~~~~~~~~~ */}
              <Route exact path="/seller/:refId/complete">
                <OrderComplete />
              </Route>

              <Route exact path="/login">
                {user.id ? (
                  // If the user is already logged in,
                  // redirect to the /home page
                  <Redirect to="/fargo/home" />
                ) : (
                  // Otherwise, show the login page
                  <LoginPage />
                )}
              </Route>

              <Route exact path="/registration">
                {user.id ? (
                  // If the user is already logged in,
                  // redirect them to the /home page
                  <Redirect to="/fargo/home" />
                ) : (
                  // Otherwise, show the registration page
                  <RegisterPage />
                )}
              </Route>

              <Route exact path="/fargo/home">
                {user.id ? <Redirect to="/fargo/home" /> : <LoginPage />}
                {/* {!user.is_admin && !user.org_admin && <Redirect to="/coupon" />} */}
              </Route>

              {/* If none of the other routes matched, we will show a 404. */}
              <Route>
                <h1>404</h1>
              </Route>
            </Switch>
          </div>
        </div>
        <Footer />
      </ThemeProvider>
    </Router>
  );
}

export default App;
