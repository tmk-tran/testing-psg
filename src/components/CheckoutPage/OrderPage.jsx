import React, { useState } from "react";
import { Button } from "@mui/material";
import { border } from "../Utils/colors";
import OrderTable from "./OrderTable";
import { historyHook } from "../../hooks/useHistory";

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
    console.log(rowId);
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  const selectedProducts = selectedRows.map(rowId => rows.find(row => row.id === rowId));
  console.log(selectedProducts);

  const handleQuantityChange = (newRows) => {
    setRows(newRows);
  };

  const handlePayment = (subtotal) => {
    // Implement payment logic here
    console.log("Subtotal being sent for payment:", subtotal);
  };
  
  const addToCart = () => {
    history.push({
        pathname: "/checkout",
        state: { selectedProducts },
      });
  };

  return (
    <div style={{ minHeight: "80vh", width: "70%", margin: "0 auto" }}>
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
        {/* <Button variant="contained" sx={{ mr: 20 }}>Pay Now</Button> */}
        <Button onClick={clearTotal}>Clear</Button>
        <Button variant="contained" onClick={addToCart}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
