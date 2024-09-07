import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Typography,
} from "@mui/material";
import { formatDateTime } from "../Utils/helpers";

const headerStyle = {
  border: "1px solid #f0f0f0",
  backgroundColor: "#d9d9d9",
};

const headerCellStyle = {
  lineHeight: 1.25,
};

const cellBorder = {
  border: "1px solid #ddd",
};

const footerCellBorder = {
  border: "1px solid #f0f0f0",
};

const alternateRowColors = {
  "&:nth-of-type(odd)": {
    backgroundColor: "rgba(0, 0, 0, 0.04)", // Light gray
  },
};

const footerCellStyle = {
  fontWeight: "bold",
  fontSize: "1.2rem",
  //   color: "#333",
  backgroundColor: "#d9d9d9",
};

export default function TransactionsTable({ transactions }) {
  // Calculate totals
  const totals = transactions.reduce(
    (acc, transaction) => {
      acc.paymentAmount += parseFloat(
        transaction.purchase_units_payments_captures_amount_value
      );
      acc.receivedGrossValue += parseFloat(
        transaction.seller_receivable_gross_amount_value
      );
      acc.paypalFee += parseFloat(
        transaction.seller_receivable_paypal_fee_value
      );
      acc.receivedNetAmount += parseFloat(
        transaction.seller_receivable_net_amount_value
      );
      return acc;
    },
    {
      paymentAmount: 0,
      receivedGrossValue: 0,
      paypalFee: 0,
      receivedNetAmount: 0,
    }
  );

  // ADD THE BOOK TYPE SOLD TO THIS TABLE FROM THE ROUTER QUERY
  return (
    <Paper>
      <TableContainer sx={{ maxHeight: 600, overflowX: "auto", width: "100%" }}>
        <Table stickyHeader style={{ minWidth: 1600 }} size="small" dense>
          {/* ~~~~~~~~~~ HEAD ~~~~~~~~~~ */}
          <TableHead>
            <TableRow>
              <TableCell sx={headerStyle}>ID</TableCell>
              <TableCell sx={headerStyle}>Book Sold</TableCell>
              <TableCell sx={headerStyle}>Created</TableCell>
              <TableCell sx={headerStyle}>Status</TableCell>
              <TableCell sx={headerStyle}>Payment Capture ID</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...headerStyle }}>
                Payment Amount
              </TableCell>
              <TableCell sx={headerStyle}>Email</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...headerStyle }}>
                Shipping Name
              </TableCell>
              <TableCell sx={headerStyle}>Shipping Address</TableCell>
              <TableCell sx={headerStyle}>Payer ID</TableCell>
              <TableCell sx={{ ...headerCellStyle, ...headerStyle }}>
                Payer Name
              </TableCell>
              <TableCell sx={{ ...headerCellStyle, ...headerStyle }}>
                Received Gross Value
              </TableCell>
              <TableCell sx={{ ...headerCellStyle, ...headerStyle }}>
                PayPal Fee
              </TableCell>
              <TableCell sx={{ ...headerCellStyle, ...headerStyle }}>
                Received Net Amount
              </TableCell>
              <TableCell sx={{ ...headerCellStyle, ...headerStyle }}>
                Account Status
              </TableCell>
            </TableRow>
          </TableHead>
          {/* ~~~~~~~~~~ BODY ~~~~~~~~~~ */}
          <TableBody>
            {transactions.map((transaction, i) => (
              <TableRow
                key={transaction.id}
                sx={{
                  ...(i % 2 === 0 ? alternateRowColors : {}),
                }}
              >
                <TableCell sx={cellBorder}>{transaction.id}</TableCell>
                <TableCell sx={noWrapBorder}>
                  {transaction.book_type_sold
                    ? transaction.book_type_sold.join(", ")
                    : ""}
                </TableCell>

                {/* ~~~~~ Created ~~~~~ */}
                <TableCell sx={noWrapBorder}>
                  {formatDateTime(
                    transaction.purchase_units_payments_captures_create_time
                  )}
                </TableCell>
                <TableCell sx={cellBorder}>{transaction.status}</TableCell>
                <TableCell sx={cellBorder}>
                  {transaction.purchase_units_payments_captures_id}
                </TableCell>
                <TableCell sx={cellBorder}>
                  ${transaction.purchase_units_payments_captures_amount_value}
                </TableCell>
                <TableCell sx={cellBorder}>
                  {transaction.payment_source_email}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap", ...cellBorder }}>
                  {transaction.purchase_units_shipping_name_full_name}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap", ...cellBorder }}>
                  {transaction.purchase_units_shipping_address_address_line_1}{" "}
                  {transaction.purchase_units_shipping_address_admin_area_2},{" "}
                  {transaction.purchase_units_shipping_address_admin_area_1}{" "}
                  {transaction.purchase_units_shipping_address_postal_code}
                </TableCell>
                <TableCell sx={cellBorder}>
                  {transaction.payment_source_account_id}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap", ...cellBorder }}>
                  {transaction.payer_name_given_name}{" "}
                  {transaction.payer_name_surname}
                </TableCell>
                <TableCell sx={cellBorder}>
                  ${transaction.seller_receivable_gross_amount_value}
                </TableCell>
                <TableCell sx={cellBorder}>
                  ${transaction.seller_receivable_paypal_fee_value}
                </TableCell>
                <TableCell sx={cellBorder}>
                  ${transaction.seller_receivable_net_amount_value}
                </TableCell>
                <TableCell sx={cellBorder}>
                  {transaction.payment_source_account_status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* ~~~~~~~~~~ FOOTER ~~~~~~~~~~ */}
          <TableFooter
            style={{ position: "sticky", bottom: 0, backgroundColor: "#fff" }}
          >
            <TableRow>
              <TableCell sx={footerCellStyle}>Totals:</TableCell>
              <TableCell sx={footerCellStyle} colSpan={3}></TableCell>
              <TableCell sx={{ ...footerCellStyle, ...footerCellBorder }}>
                ${totals.paymentAmount.toFixed(2)}
              </TableCell>
              <TableCell sx={footerCellStyle} colSpan={5}></TableCell>
              <TableCell sx={{ ...footerCellStyle, ...footerCellBorder }}>
                ${totals.receivedGrossValue.toFixed(2)}
              </TableCell>
              <TableCell sx={{ ...footerCellStyle, ...footerCellBorder }}>
                ${totals.paypalFee.toFixed(2)}
              </TableCell>
              <TableCell sx={{ ...footerCellStyle, ...footerCellBorder }}>
                ${totals.receivedNetAmount.toFixed(2)}
              </TableCell>
              <TableCell sx={footerCellStyle} colSpan={3}></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
}
