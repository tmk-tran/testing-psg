import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
// ~~~~~~~~~~ Components ~~~~~~~~~~~~~~~~~~~~~~~~~~
import OrderSummaryTable from "./OrderSummaryTable";
import TotalUpdate from "./TotalUpdate";
import CustomButton from "../CustomButton/CustomButton";
import Typography from "../Typography/Typography";
import CashCheckSelector from "./CashCheckSelector";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { dispatchHook } from "../../hooks/useDispatch";
import { appActiveYear, sellerPageInfo } from "../../hooks/reduxStore";
import { historyHook } from "../../hooks/useHistory";
import { containerStyle } from "../Utils/pageStyles";
import { border } from "../Utils/colors";
import { submitPaymentSweetAlert } from "../Utils/sweetAlerts";

export default function ShoppingCart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = dispatchHook();
  const location = useLocation();
  const history = historyHook();
  // ~~~~~~~~~~ Location State ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
  const seller = location.state?.seller ?? [];
  const sellerId = location.state?.sellerId ?? "";
  const refId = seller.refId ?? "";
  const caseType = location.state?.caseType ?? [];
  // ~~~~~~~~~~ State ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
  const [selectedProducts, setSelectedProducts] = useState(
    location.state?.selectedProducts ?? []
  );
  const [orderTotal, setOrderTotal] = useState(0);
  const [customDonation, setCustomDonation] = useState(
    location.state?.customDonation ?? 0
  );
  const [physicalBooks, setPhysicalBooks] = useState(0);
  const [paymentSelectorOpen, setPaymentSelectorOpen] = useState(false);
  // ~~~~~~~~~~ Redux Store ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
  const sellerData = sellerPageInfo() || [];
  const orgId = sellerData[0].organization_id;
  const currentYear = appActiveYear() || [];
  const activeYearId = currentYear ? currentYear[0].id : "";

  const handleUpdateQuantity = (updatedQuantities) => {
    // Update the state passed through the URL with updatedQuantities
    setSelectedProducts(
      selectedProducts.map((product) =>
        updatedQuantities.hasOwnProperty(product.id)
          ? { ...product, quantity: updatedQuantities[product.id] }
          : product
      )
    );
  };

  const goBack = () => {
    history.goBack();
  };

  const toCheckout = () => {
    history.push({
      pathname: `/seller/${refId}/${caseType}/checkout`,
      state: { selectedProducts, orderTotal, customDonation },
    });
  };

  const submitOrder = (caseType) => {
    const saveCall = () => {
      const updateAction = {
        type: `UPDATE_${caseType.toUpperCase()}`,
        payload: {
          id: sellerId,
          refId: refId,
          orgId: orgId,
          yearId: activeYearId,
          [caseType.toLowerCase()]: Number(orderTotal),
          updateType: caseType.toLowerCase(),
        },
      };
      const updateTransactionsAction = {
        type: `UPDATE_BOOKS_SOLD`,
        payload: {
          refId: refId,
          orgId: orgId,
          yearId: activeYearId,
          physical_book_cash: physicalBooks,
          physical_book_digital: 0,
          digital_book_credit: 0,
        },
      };
      let updateActions = [updateAction, updateTransactionsAction];

      if (customDonation > 0) {
        const updateSellerTable = {
          type: `UPDATE_DONATIONS`,
          payload: {
            updateType: "donations",
            id: sellerId,
            refId: refId,
            orgId: orgId,
            yearId: activeYearId,
            donations: customDonation,
          },
        };
        updateActions.push(updateSellerTable);
      }
      updateActions.forEach((action) => dispatch(action));
      history.push(`/seller/${refId}/complete`);
    };

    submitPaymentSweetAlert(saveCall);
  };

  const openCashCheckSelector = () => {
    setPaymentSelectorOpen(true);
  };

  const closeCashCheckSelector = () => {
    setPaymentSelectorOpen(false);
  };

  return (
    <div style={{ ...containerStyle, ...(isMobile && { width: "100%" }) }}>
      <div
        style={{
          marginTop: "53px",
          marginBottom: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* ~~~~~~~~~~ HEADER ~~~~~~~~~~~~~ */}
        <Typography
          label="Shopping Cart"
          variant="h5"
          sx={{ pt: 2, mb: 5, fontWeight: "bold" }}
        />
        {/* ~~~~~~~~~~ ORDER ~~~~~~~~~~~~~ */}
        {/* START HERE ON RETURN , ADD PROPS HERE FOR CASETYPE */}
        {/* TO SHOW CUSTOM INSTRUCTIONS FOR DIGITAL COUPON BOOKS, EMAIL ENTER */}
        {selectedProducts.length > 0 ? (
          <OrderSummaryTable
            selectedProducts={selectedProducts}
            customDonation={customDonation}
            setCustomDonation={setCustomDonation}
            onUpdateQuantity={handleUpdateQuantity}
            caseType={caseType}
            setPhysicalBooks={setPhysicalBooks}
          />
        ) : (
          <Typography label="No items in cart" />
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "2%",
          }}
        >
          <div style={{ marginRight: 10 }}>
            <TotalUpdate
              selectedProducts={selectedProducts}
              customDonation={customDonation}
              onChange={(total) => {
                setOrderTotal(total);
              }}
            />
          </div>
        </div>
      </div>
      {paymentSelectorOpen && (
        <CashCheckSelector
          open={paymentSelectorOpen}
          handleClose={closeCashCheckSelector}
          submitOrder={submitOrder}
        />
      )}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <CustomButton label="Back" onClick={goBack} />
        {/* {!caseType ? (
          <CustomButton
            label="Proceed to Checkout"
            onClick={toCheckout}
            variant="contained"
          />
        ) : (
          <CustomButton
            label="Submit Order"
            onClick={() => submitOrder(caseType)}
            variant="contained"
          />
        )} */}
        {!caseType ? (
          <CustomButton
            label="Proceed to Checkout"
            onClick={toCheckout}
            variant="contained"
          />
        ) : (
          <>
            {caseType === "cash" && (
              <CustomButton
                label="Complete Order"
                // onClick={() => submitOrder("cash")}
                onClick={() => openCashCheckSelector()}
                variant="contained"
              />
            )}
            {caseType === "paypal" && (
              <CustomButton
                label="Proceed to Checkout"
                onClick={() => toCheckout()}
                variant="contained"
              />
            )}
            {caseType === "credit" && (
              <CustomButton
                label="Proceed to Checkout"
                onClick={() => toCheckout()}
                variant="contained"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
