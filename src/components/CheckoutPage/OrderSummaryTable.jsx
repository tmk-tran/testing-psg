import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Typography,
} from "@mui/material";

export default function OrderSummaryTable({
  selectedProducts,
  customDonation,
  setCustomDonation,
  onUpdateQuantity,
  caseType,
  setPhysicalBooks,
}) {
  console.log(selectedProducts);
  console.log(caseType);
  const [localQuantities, setLocalQuantities] = useState(
    selectedProducts.reduce((quantities, product) => {
      quantities[product.id] = product.quantity;
      return quantities;
    }, {})
  );
  console.log(localQuantities);
  console.log(customDonation);
  const [orderTotal, setOrderTotal] = useState(0);
  console.log(orderTotal);

  useEffect(() => {
    let bookTotal = 0;

    // Iterate over the entries of localQuantities
    Object.entries(localQuantities).forEach(([id, quantity]) => {
      // Convert quantity to a number
      const qty = Number(quantity, 10);

      // Find the product with the matching id
      const product = selectedProducts.find(
        (prod) => prod.id === parseInt(id, 10)
      );

      // If the product is found, add the price multiplied by the quantity to the bookTotal
      if (product.bookType === "Physical Coupon Book") {
        bookTotal += qty;
      }
    });

    // Update the state in parent with the total cash for physical books
    {
      caseType !== "Summary" ? setPhysicalBooks(bookTotal) : null;
    }
    // setPhysicalBooks(bookTotal);
  }, [localQuantities, selectedProducts]);

  const handleQuantityChange = (productId, newQuantity) => {
    console.log(productId, newQuantity);
    if (productId === 4) {
      setCustomDonation(newQuantity);
    } else {
      const updatedQuantities = {
        ...localQuantities,
        [productId]: newQuantity,
      };
      setLocalQuantities(updatedQuantities);
      onUpdateQuantity(updatedQuantities);
    }
  };

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Book Type</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell align="right">Subtotal</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedProducts.length > 0 ? (
            selectedProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell>
                  {/* ~~~~~~~~~~ HELPER TEXT FOR EMAIL ~~~~~~~~~ */}
                  {product.bookType ===
                    "Fargo - Moorhead (Digital Coupon Book)" ||
                  product.bookType === "Grand Forks (Digital Coupon Book)" ? (
                    <>
                      {product.bookType}
                      {caseType !== "Summary" ? (
                        <>
                          <br />
                          <Typography
                            variant="caption"
                            sx={{ ml: 1, fontWeight: "bold" }}
                          >
                            *please enter email during checkout
                          </Typography>
                        </>
                      ) : null}
                    </>
                  ) : (
                    <>{product.bookType}</>
                  )}
                </TableCell>

                <TableCell>
                  {product.bookType === "Donate" ? (
                    <Typography>-</Typography>
                  ) : (
                    `$ ${product.price}`
                  )}
                </TableCell>

                <TableCell align="right" sx={{ width: "10%" }}>
                  {/* ~~~~~~~~~~ Watch for multiple caseTypes ~~~~~~~~~ */}
                  {["Summary", "paypal", "credit", "cash"].includes(caseType) &&
                    (product.bookType ===
                      "Fargo - Moorhead (Digital Coupon Book)" ||
                    product.bookType === "Grand Forks (Digital Coupon Book)" ? (
                      // Render a disabled TextField with a value of 1 for these book types
                      <TextField
                        disabled
                        type="number"
                        value={1}
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    ) : (
                      // Render a normal TextField with the corresponding quantity
                      <TextField
                        type="number"
                        value={
                          product.bookType === "Donate"
                            ? customDonation
                            : localQuantities[product.id]
                        }
                        onChange={(e) =>
                          handleQuantityChange(product.id, e.target.value)
                        }
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    ))}
                </TableCell>

                <TableCell align="right">
                  {product.bookType !== "Donate" ? (
                    <>$ {product.price * localQuantities[product.id]}</>
                  ) : (
                    <>$ {customDonation}</>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography variant="h6" gutterBottom>
                  No products selected.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
