import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { historyHook } from "../../hooks/useHistory";
import { dispatchHook } from "../../hooks/useDispatch";
import { containerStyle } from "../Utils/pageStyles";
import { navButtonStyle } from "./checkoutStyles";
import { sellerPageInfo } from "../../hooks/reduxStore";
import { border } from "../Utils/colors";
// ~~~~~~~~~~ Components ~~~~~~~~~ //
import CustomButton from "../CustomButton/CustomButton";
import Typography from "../Typography/Typography";
import OrderTable from "./OrderTable";
import CustomerNameInfo from "../SellerPage/CustomerNameInfo";
import RefIdDisplay from "../SellerPage/RefIdDisplay";
import { useSelector } from "react-redux";

export default function OrderPage({ caseType }) {
  console.log(caseType);
  const seller = useParams();
  console.log(seller);
  const dispatch = dispatchHook();
  const history = historyHook();
  const auth = useSelector((store) => store.auth)

  const [selectedRows, setSelectedRows] = useState([]);
  const [customDonation, setCustomDonation] = useState(0);
  console.log(customDonation);
  const [orderTotal, setOrderTotal] = useState(0);
  console.log(orderTotal);

  // Seller info from store //
  const sellerData = sellerPageInfo() || [];
  console.log(sellerData);
  // Extract the seller ID //
  const [firstSeller] = sellerData;
  const sellerId = firstSeller ? firstSeller.id : null;
  console.log(sellerId);

  // UPDATE WITH ACTUAL STORE DATA ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [rows, setRows] = useState([
    { id: 1, bookType: "Physical Coupon Book", price: 25, quantity: 0 },
    {
      id: 2,
      bookType: "Fargo - Moorhead (Digital Coupon Book)",
      price: 25,
      quantity: 0,
    },
    {
      id: 3,
      bookType: "Grand Forks (Digital Coupon Book)",
      price: 25,
      quantity: 0,
    },
    { id: 4, bookType: "Donate", price: 0, quantity: 0 },
  ]);

  useEffect(() => {
    const setRowsBasedOnCaseType = (caseType) => {
      switch (caseType) {
        case "cash":
          setRows((prevRows) =>
            prevRows.filter((row) => row.id === 1 || row.id === 4)
          );
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
      return rows.find((row) => row.id === selectedId);
    });
  };

  const selectedProducts = mapSelectedRowsToProducts();
  console.log("Selected Products:", selectedProducts);

  const handlePayment = (total) => {
    // Implement payment logic here
    console.log("Subtotal being sent for payment:", total);
    setOrderTotal(total);
  };

  const handleFormChange = (incomingData) => {
    console.log(incomingData);

    const dispatchAction = {
      type: "ADD_CUSTOMER",
      payload: {newCustomer: incomingData, auth: auth}
    };
    console.log("Dispatching action:", dispatchAction);
    dispatch(dispatchAction);
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
    <div style={containerStyle}>
      <Typography
        // label="Order Books"
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
      <Box sx={{ mb: 1 }}>
        <RefIdDisplay seller={seller} />
      </Box>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ Customer info fields ~~~~~~~~~~ */}
      {caseType === "cash" && (
        <Box sx={{ mb: 2 }}>
          <CustomerNameInfo onSubmit={handleFormChange} />
        </Box>
      )}
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~ Order Table ~~~~~~~~~~ */}
      <OrderTable
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
          // onClick={addToCart}
          onClick={addToCart}
          variant="contained"
        />
      </Box>
    </div>
  );
}
