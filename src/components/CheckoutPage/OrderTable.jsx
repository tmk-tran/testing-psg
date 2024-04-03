import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  TextField,
  Typography,
} from "@mui/material";
import { border } from "../Utils/colors";

export default function OrderTable({
  isMobile,
  rows,
  selectedRows,
  handleRowSelect,
  handleQuantityChange,
  handlePayment,
  customDonation,
  setCustomDonation,
}) {
  console.log(rows);
  console.log(selectedRows);

  const total =
    rows.reduce((acc, row) => acc + row.price * row.quantity, 0) +
    customDonation;
  console.log(total);

  useEffect(() => {
    handlePayment(total);
  }, [rows, customDonation]);

  const quantityChange = (e, row) => {
    const newQuantity = parseInt(e.target.value, 10);
    const updatedRows = rows.map((r) => {
      if (r.id === row.id) {
        return { ...r, quantity: newQuantity };
      }
      return r;
    });

    if (row.bookType === "Donate") {
      const updatedRow = { ...row, quantity: newQuantity };
      const donationIndex = updatedRows.findIndex((r) => r.id === row.id);
      updatedRows.splice(donationIndex, 1, updatedRow);
    }
    console.log(updatedRows);

    handleQuantityChange(updatedRows);

    const totalAmount = updatedRows.reduce(
      (acc, r) => acc + r.price * r.quantity,
      0
    );
    console.log(totalAmount);

    const withDonation = customDonation + totalAmount;
    console.log(withDonation);
  };

  // const total =
  //   rows.reduce((acc, row) => acc + row.price * row.quantity, 0) +
  //   customDonation;
  // console.log(total);
  // handlePayment(total);

  const mapSelectedRowsToProducts = () => {
    return selectedRows.map((selectedId) => {
      return rows.find((row) => row.id === selectedId);
    });
  };

  const selectedProducts = mapSelectedRowsToProducts();
  console.log("Selected Products:", selectedProducts);

  return (
    <TableContainer
      style={{
        width: "100%",
        overflowX: "auto",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Select</TableCell>
            <TableCell>Book Type</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Subtotal</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Checkbox
                  checked={selectedRows.includes(row.id)}
                  onChange={() => handleRowSelect(row.id)}
                />
              </TableCell>
              <TableCell>
                {row.bookType.includes(
                  "Fargo - Moorhead (Digital Coupon Book"
                ) ||
                row.bookType.includes("Grand Forks (Digital Coupon Book)") ? (
                  <>
                    {row.bookType}
                    <br />
                    <Typography
                      variant="caption"
                      sx={{ ml: 1, fontWeight: "bold" }}
                    >
                      *email is required for purchase
                    </Typography>
                  </>
                ) : (
                  <>{row.bookType}</>
                )}
              </TableCell>
              <TableCell>
                {row.bookType === "Donate" ? (
                  <Typography>-</Typography>
                ) : (
                  `$ ${row.price}`
                )}
              </TableCell>
              <TableCell>
                {selectedRows.includes(row.id) ? (
                  row.bookType === "Donate" ? (
                    <TextField
                      label="Custom Donation"
                      type="number"
                      value={customDonation}
                      onChange={(e) =>
                        setCustomDonation(parseInt(e.target.value, 10))
                      }
                      InputProps={{ inputProps: { min: 0 } }}
                      sx={{ width: isMobile ? "100%" : "35%" }}
                    />
                  ) : (
                    <>
                      {(row.bookType ===
                        "Fargo - Moorhead (Digital Coupon Book)" ||
                        row.bookType ===
                          "Grand Forks (Digital Coupon Book)") && (
                        <TextField
                          disabled
                          type="number"
                          value={1} // Set quantity to 1 for these bookTypes
                          InputProps={{ inputProps: { min: 1 } }}
                          sx={{ width: isMobile ? "100%" : "20%" }}
                        />
                      )}
                      {row.bookType !==
                        "Fargo - Moorhead (Digital Coupon Book)" &&
                        row.bookType !==
                          "Grand Forks (Digital Coupon Book)" && (
                          <TextField
                            type="number"
                            value={row.quantity}
                            onChange={(e) => quantityChange(e, row)}
                            InputProps={{ inputProps: { min: 1 } }}
                            sx={{ width: isMobile ? "100%" : "20%" }}
                          />
                        )}
                    </>
                  )
                ) : (
                  <TextField
                    disabled
                    type="number"
                    value={row.quantity}
                    InputProps={{ inputProps: { min: 1 } }}
                    sx={{ width: isMobile ? "100%" : "20%" }}
                  />
                )}
              </TableCell>

              <TableCell>
                {row.bookType !== "Donate" ? (
                  <>$ {row.price * row.quantity}</>
                ) : (
                  <>$ {customDonation}</>
                )}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3} sx={{ border: "none" }} />
            <TableCell align="right" sx={{ border: "none" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Total:
              </Typography>
            </TableCell>
            <TableCell align="left" sx={{ border: "none" }}>
              <Typography variant="h6">${total}</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
