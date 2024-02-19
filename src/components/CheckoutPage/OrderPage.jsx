import React, { useState } from "react";
import { Button } from "@mui/material";
import OrderTable from "./OrderTable";
import { historyHook } from "../../hooks/useHistory";
import { containerStyle } from "./OrderSummary";
import { border } from "../Utils/colors";
import CustomButton from "../CustomButton/CustomButton";

export default function OrderPage() {
  const history = historyHook();

  const [selectedRows, setSelectedRows] = useState([]);
  console.log(selectedRows);
  const [customDonation, setCustomDonation] = useState(0);
  console.log(customDonation);

  // UPDATE WITH ACTUAL STORE DATA ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [rows, setRows] = useState([
    { id: 1, bookType: "Print Paper Coupon", price: 25, quantity: 0 },
    {
      id: 2,
      bookType: "Fargo - Moorhead (Digital Coupon)",
      price: 25,
      quantity: 0,
    },
    { id: 3, bookType: "Grand Forks (Digital Coupon)", price: 25, quantity: 0 },
    { id: 4, bookType: "Donate", price: 0, quantity: 0 },
  ]);

  const clearTotal = () => {
    const updatedRows = rows.map((row) => ({ ...row, quantity: 0 }));
    setRows(updatedRows);
    clearDonation();
  };

  const clearDonation = () => {
    setCustomDonation(0);
  };

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

  //   const selectedProducts = selectedRows.map(rowId => rows.find(row => row.id === rowId));
  //   console.log(selectedProducts);

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
  };

  const addToCart = () => {
    history.push({
      pathname: "/ordersummary",
      state: { rows, selectedProducts, customDonation },
    });
  };

  return (
    <div style={containerStyle}>
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
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <CustomButton label="Clear" onClick={clearTotal} />
        <CustomButton
          label="Add to Cart"
          onClick={addToCart}
          variant="contained"
        />
      </div>
    </div>
  );
}
