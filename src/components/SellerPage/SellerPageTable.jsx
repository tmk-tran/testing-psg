import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Button,
} from "@mui/material";
import { columns } from "../OrgSellers/sellerTableColumns";
import CashUpdateModal from "./CashUpdateModal";

export default function SellerPageTable({ sellerInfo }) {
  if (!sellerInfo || sellerInfo.length === 0) {
    return <Typography>No data available</Typography>;
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          {/* ~~~~~~~~~~ HEAD ~~~~~~~~~~ */}
          <TableHead>
            <TableRow>
              {columns
                .filter(
                  (column) =>
                    column.id !== "notes" &&
                    column.id !== "actions" &&
                    column.id !== "initial_books" &&
                    column.id !== "additional_books" &&
                    column.id !== "digital" &&
                    column.id !== "books_returned" &&
                    column.id !== "digital_donations"
                ) // Exclude the "notes", "actions", "initial books", "additional books", and "returned books" column
                .map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    sx={{
                      minWidth: column.minWidth,
                      width: column.width,
                      height: 50,
                      wordWrap: "break-word",
                      border: "1px solid #f0f0f0",
                      backgroundColor: "#d9d9d9",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          {/* ~~~~~~~~~~ BODY ~~~~~~~~~~ */}
          <TableBody>
            {sellerInfo.map((seller, i) => (
              <TableRow key={i}>
                {columns
                  .filter(
                    (column) =>
                      column.id !== "notes" &&
                      column.id !== "actions" &&
                      column.id !== "initial_books" &&
                      column.id !== "additional_books" &&
                      column.id !== "digital" &&
                      column.id !== "books_returned" &&
                      column.id !== "digital_donations"
                  ) // Exclude the "notes", "actions", "initial books", "additional books", and "returned books" column
                  .map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {seller[column.id]}
                    </TableCell>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
