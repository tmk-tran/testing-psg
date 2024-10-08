import React from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Typography,
} from "@mui/material";
import { centerStyle, formatDate } from "../Utils/helpers";
import "./TableGroupDetails.css";

export default function TableGroupDetails({
  totalGoals,
  totalReceived,
  fundraiserInfo,
}) {
  return (
    <Table className="custom-table">
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography variant="body1" style={centerStyle} sx={{ mb: 1, mt: 2, fontWeight: "bold" }}>
              Total Goal:
            </Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body1" sx={{ fontSize: "25px", fontWeight: "bold" }}>
              {totalGoals > 0 ? (
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0, // Set this to 2 if you want cents
                }).format(totalGoals)
              ) : (
                <span>No Active Fundraiser</span>
              )}
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>
            <Typography sx={centerStyle}>Received:</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="h6">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0, // Set this to 2 if you want cents
              }).format(totalReceived)}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography sx={{ ...centerStyle, mb: 2 }}>Fundraiser End Date(s):</Typography>
          </TableCell>
          <TableCell>
            {fundraiserInfo.map((fundraiser) =>
              !fundraiser.fundraiser_closed ? (
                <Typography
                  key={fundraiser.fundraiser_id}
                  sx={{ fontWeight: "bold", mb: 2 }}
                >
                  {formatDate(fundraiser.fundraiser_end_date)}
                </Typography>
              ) : null
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
