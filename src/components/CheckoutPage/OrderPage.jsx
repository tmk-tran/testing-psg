import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, useTheme, useMediaQuery } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { historyHook } from "../../hooks/useHistory";
import { containerStyle } from "../Utils/pageStyles";
import { navButtonStyle } from "./checkoutStyles";
import { sellerPageInfo } from "../../hooks/reduxStore";
// ~~~~~~~~~~ Components ~~~~~~~~~ //
import CustomButton from "../CustomButton/CustomButton";
import Typography from "../Typography/Typography";
import OrderTable from "./OrderTable";
import CustomerNameInfo from "../SellerPage/CustomerNameInfo"; // Disabled on July 2, 2024 (client request)
import RefIdDisplay from "../SellerPage/RefIdDisplay";

export default function OrderPage({ caseType }) {
  const seller = useParams();
  const history = historyHook();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedRows, setSelectedRows] = useState([]);
  const [customDonation, setCustomDonation] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);

  // Seller info from store //
  const sellerData = sellerPageInfo() || [];
  // Extract the seller ID //
  const [firstSeller] = sellerData;
  const sellerId = firstSeller ? firstSeller.id : null;
  const [showOrderTable, setShowOrderTable] = useState(false);
  const [pageLoad, setPageLoad] = useState(true);

  // UPDATE WITH ACTUAL STORE DATA ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [rows, setRows] = useState([
    { id: 1, bookType: "Physical Coupon Book", price: 25, quantity: 0 },
    {
      id: 2,
      bookType: "Fargo - Moorhead (Digital Coupon Book)",
      price: 25,
      quantity: 0,
    },
    // {
    //   id: 3,
    //   bookType: "Grand Forks (Digital Coupon Book)",
    //   price: 25,
    //   quantity: 0,
    // },
    { id: 4, bookType: "Donate", price: 0, quantity: 0 },
  ]);

  useEffect(() => {
    const setRowsBasedOnCaseType = (caseType) => {
      switch (caseType) {
        case "cash":
          setRows((prevRows) =>
            prevRows.filter((row) => row.id === 1 || row.id === 4)
          );
          setShowOrderTable(true);
          break;
        // Add other case types if needed
        default:
          break;
      }
    };

    setRowsBasedOnCaseType(caseType);
  }, [caseType]);

  const handleRowSelect = (rowId) => {
    let newRows = [...rows];
    let newSelectedRows = [...selectedRows];

    // Toggle selection
    if (newSelectedRows.includes(rowId)) {
      // Deselect row
      newSelectedRows = newSelectedRows.filter((id) => id !== rowId);
      // Reset quantity to 0
      newRows = newRows.map((row) =>
        row.id === rowId ? { ...row, quantity: 0 } : row
      );
    } else {
      // Select row
      newSelectedRows.push(rowId);
      // Reset quantity to 1
      newRows = newRows.map((row) =>
        row.id === rowId ? { ...row, quantity: 1 } : row
      );
    }

    setSelectedRows(newSelectedRows);
    setRows(newRows);
  };

  const handleQuantityChange = (newRows) => {
    setRows(newRows);
  };

  const mapSelectedRowsToProducts = () => {
    return selectedRows.map((selectedId) => {
      const row = rows.find((row) => row.id === selectedId);
      if (row.id === 4) {
        // Set the price of the donation product to customDonation
        return { ...row, price: customDonation };
      }
      return row;
    });
  };

  const selectedProducts = mapSelectedRowsToProducts();

  const handlePayment = (subTotal) => {
    // Implement payment logic here
    setOrderTotal(subTotal);
  };

  const addToCart = () => {
    history.push({
      pathname: `/seller/${seller.refId}/${caseType}/cart`,
      state: {
        seller,
        sellerId,
        caseType,
        rows,
        selectedProducts,
        customDonation,
        orderTotal,
      },
    });
  };

  const clearTotal = () => {
    const updatedRows = rows.map((row) => ({ ...row, quantity: 0 }));
    setRows(updatedRows);
    clearDonation();
  };

  const clearDonation = () => {
    setCustomDonation(0);
  };

  return (
    <div style={{ ...containerStyle, ...(isMobile && { width: "100%" }) }}>
      <Typography
        label={
          caseType === "cash"
            ? "Cash / Check"
            : caseType === "paypal"
            ? "PayPal"
            : caseType === "credit"
            ? "Credit / Debit Card"
            : "Order Books"
        }
        variant="h5"
        sx={{ textAlign: "center", fontWeight: "bold", py: 3 }}
      />
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ Referral ID displayed here ~~~~~~~~~~ */}
      <Box sx={{ mb: pageLoad ? 3 : 1 }}>
        <RefIdDisplay seller={seller} pageLoad={pageLoad} />
      </Box>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ Customer info fields ~~~~~~~~~~ */}
      {/* Removed on July 2, 2024 after feedback from client */}
      {/* Need to define onSubmit if reinstated, and also */}
      {/* an endpoint for the backend (where to save?) */}
      {/* {caseType === "cash" && (
        <Box sx={{ mb: 2 }}>
          <CustomerNameInfo
            onSubmit={handleFormChange}
            setShowOrderTable={setShowOrderTable}
            pageLoad={pageLoad}
            setPageLoad={setPageLoad}
          />
          <Divider sx={{ mt: 2, ...lineDivider }} />
        </Box>
      )} */}
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ Order Table ~~~~~~~~~~ */}
      {caseType === "cash" && showOrderTable && (
        <>
          <OrderTable
            isMobile={isMobile}
            rows={rows}
            selectedRows={selectedRows}
            handleRowSelect={handleRowSelect}
            handleQuantityChange={handleQuantityChange}
            handlePayment={handlePayment}
            customDonation={customDonation}
            setCustomDonation={setCustomDonation}
            clearDonation={clearDonation}
          />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ Buttons ~~~~~~~~~~ */}
          <Box sx={navButtonStyle}>
            <CustomButton label="Clear" onClick={clearTotal} />
            <CustomButton
              label="Add to Cart"
              onClick={addToCart}
              variant="contained"
            />
          </Box>
        </>
      )}
      {(!caseType || (caseType !== "cash" && !showOrderTable)) && (
        <>
          <OrderTable
            isMobile={isMobile}
            rows={rows}
            selectedRows={selectedRows}
            handleRowSelect={handleRowSelect}
            handleQuantityChange={handleQuantityChange}
            handlePayment={handlePayment}
            customDonation={customDonation}
            setCustomDonation={setCustomDonation}
            clearDonation={clearDonation}
          />
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~~ Buttons ~~~~~~~~~~ */}
          <Box sx={navButtonStyle}>
            <CustomButton label="Clear" onClick={clearTotal} />
            <CustomButton
              label="Add to Cart"
              onClick={addToCart}
              variant="contained"
            />
          </Box>
        </>
      )}
    </div>
  );
}
