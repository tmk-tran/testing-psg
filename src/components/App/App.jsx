import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import UserProfile from "../UserProfile/UserProfile";
import HomePage from "../HomePage/HomePage";
import Details from "../Details/Details";
import LandingPage from "../LandingPage/LandingPage";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import Footer from "../Footer/Footer";
import GroupDetails from "../GroupDetails/GroupDetails";
import MenuLinks from "../MenuLinks/MenuLinks";
import ArchivedOrganizations from "../ArchivedOrganizations/ArchivedOrganizations";
import GlobalFundraiserInput from "../GlobalFundraiserInput/GlobalFundraiserInput";
import Header from "../Header/Header";
import Footer2 from "../Footer2/Footer2";
import Footer3 from "../Footer3/Footer3";
import TaskTabs from "../TaskTabs/TaskTabs";
import CouponReviewDetails from "../CouponReviewDetails/CouponReviewDetails";
import CheckoutPage from "../CheckoutPage/CheckoutPage";
import OrderPage from "../CheckoutPage/OrderPage";
import OrgSellers from "../OrgSellers/OrgSellers";
import ShoppingCart from "../CheckoutPage/ShoppingCart";
import SellerPage from "../SellerPage/SellerPage";
import ConsumerCouponView from "../ConsumerCouponView/ConsumerCouponView";
import SellerLandingPage from "../SellerPage/SellerLandingPage";
import OrderComplete from "../CheckoutPage/OrderComplete";
import Transactions from "../Transactions/Transactions";
import MerchantDetails from "../Details/MerchantDetails";
import NewBookYear from "../NewBookYear/NewBookYear";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { dispatchHook } from "../../hooks/useDispatch";
import { User } from "../../hooks/reduxStore";

// ~~~~~ Theme establishing global color for MUI ~~~~~
const theme = createTheme({
  typography: {
    fontSize: 18,
    // fontFamily: 'Lato, "Helvetica Neue", Arial, sans-serif',
    fontFamily: "Helvetica Neue",
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
  console.log(user);

  // add a function here to set current year for fetch
  // will have to auto update for when year changes
  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
    // dispatch({ type: "FETCH_COUPON_BOOKS" });
    const dispatchAction2 = {
      type: "FETCH_BOOK_YEAR",
      payload: 1,
    };
    console.log(dispatchAction2);
    dispatch(dispatchAction2);
  }, []);

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
          <Header user={user} />
          <div style={{ flex: "1 0 auto", padding: "20px" }}>
            <MenuLinks />
            <Switch>
              <Redirect exact from="/" to="/fargo/home" />

              <ProtectedRoute exact path="/fargo/home">
                {user.is_admin && <HomePage />}
                {/* {user.org_admin && <HomePage isOrgAdmin={true} />} */}
                {user.org_admin && user.graphic_designer && (
                  <HomePage isOrgAdmin={true} isGraphicDesigner={true} />
                )}
                {/* {!user.org_admin && !user.graphic_designer && (
                  <HomePage isOrgAdmin={false} />
                )} */}
                {user.org_admin && !user.graphic_designer && (
                  <HomePage isOrgAdmin={true} />
                )}
                {/* {user.graphic_designer && <HomePage isGraphicDesigner={true} />} */}
                {!user.org_admin && user.graphic_designer && (
                  <HomePage isGraphicDesigner={true} />
                )}
                {!user.is_admin &&
                  !user.org_admin &&
                  !user.graphic_designer && <Redirect to="/fargo/coupon" />}
              </ProtectedRoute>

              <ProtectedRoute exact path="/userProfile/:id">
                <UserProfile />
              </ProtectedRoute>

              {user.is_admin && (
                <ProtectedRoute exact path="/fargo/newFundraiser">
                  <GlobalFundraiserInput />
                </ProtectedRoute>
              )}

              {user.is_admin && (
                <ProtectedRoute exact path="/fargo/archivedOrganizations">
                  <ArchivedOrganizations />
                </ProtectedRoute>
              )}

              <ProtectedRoute exact path="/group/:id">
                <GroupDetails user={user} />
              </ProtectedRoute>

              <ProtectedRoute exact path="/fargo/coupon">
                <ConsumerCouponView />
              </ProtectedRoute>

              {(user.is_admin || user.graphic_designer) && (
                <ProtectedRoute exact path="/fargo/tasks">
                  <TaskTabs />
                </ProtectedRoute>
              )}

              {user.is_admin && (
                <ProtectedRoute exact path="/fargo/transactions">
                  <Transactions />
                </ProtectedRoute>
              )}

              {user.is_admin && (
                <ProtectedRoute exact path="/fargo/books">
                  <NewBookYear />
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

              {/* <ProtectedRoute exact path="/order">
                <OrderPage />
              </ProtectedRoute> */}

              <ProtectedRoute exact path="/fargo/sellers">
                <OrgSellers />
              </ProtectedRoute>

              <Route exact path="/fargo/seller/:refId/">
                {/* <OrderPage /> */}
                <SellerLandingPage />
              </Route>
              {/* ~~~~~~~~~~ CASH PAGE ~~~~~~~~~~ */}
              <Route exact path="/fargo/seller/:refId/cash">
                <OrderPage caseType="cash" />
                {/* <SellerLandingPage /> */}
              </Route>

              <Route exact path="/fargo/seller/:refId/cash/cart">
                <ShoppingCart caseType="cash" />
              </Route>
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~ PAYPAL PAGE ~~~~~~~~ */}
              <Route exact path="/fargo/seller/:refId/paypal">
                <OrderPage caseType="paypal" />
              </Route>

              <Route exact path="/fargo/seller/:refId/paypal/cart">
                <ShoppingCart />
              </Route>
              {/* ~~~~~~~~~~ CHECKOUT PAGE ~~~~~~~~~ */}
              <Route exact path="/fargo/seller/:refId/paypal/checkout">
                <CheckoutPage caseType="credit" />
              </Route>
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~ CREDIT PAGE ~~~~~~~~~~~ */}
              <Route exact path="/fargo/seller/:refId/credit">
                <OrderPage caseType="credit" />
              </Route>

              <Route exact path="/fargo/seller/:refId/credit/cart">
                <ShoppingCart />
              </Route>
              {/* ~~~~~~~~~~ CHECKOUT PAGE ~~~~~~~~~ */}
              <Route exact path="/fargo/seller/:refId/credit/checkout">
                <CheckoutPage caseType="credit" />
              </Route>
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~ ORDER COMPLETE PAGE ~~~~~~~~~ */}
              <Route exact path="/fargo/seller/:refId/complete">
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
          {/* <Footer /> */}
          {/* <Footer2 /> */}
        </div>
        <Footer3 />
      </ThemeProvider>
    </Router>
  );
}

export default App;
