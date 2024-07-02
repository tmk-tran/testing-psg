import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  capitalizeFirstWord,
  capitalizeStateAbbr,
  capitalizeWords,
  formatPhoneNumber,
} from "../Utils/helpers";

const tableHeaderStyle = {
  minWidth: 150,
  padding: "8px",
  lineHeight: "1.2", // Adjust the line height
  fontSize: "1.1rem", // Adjust the font size
};
const tableCellStyle = {
  whiteSpace: "normal",
  minWidth: 150,
  padding: "8px",
  lineHeight: "1.2", // Adjust the line height
  fontSize: "1rem", // Adjust the font size
};

export default function MyTable({ data }) {

  return (
    <Table>
      <TableHead>
        <TableRow>
          {/* <TableCell style={tableHeaderStyle}>Name</TableCell> */}
          <TableCell style={tableHeaderStyle}>Address</TableCell>
          <TableCell style={tableHeaderStyle}>Contact Number</TableCell>
          <TableCell style={tableHeaderStyle}>Additional Details</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {/* ~~~~~~~~~ ADDRESS ~~~~~~~~~ */}
          <TableCell style={tableCellStyle}>
            {capitalizeWords(data.address)}
            <br />
            {capitalizeFirstWord(data.city)}, {capitalizeStateAbbr(data.state)}{" "}
            {data.zip}
          </TableCell>
          {/* ~~~~~~~~~ PHONE ~~~~~~~~~ */}
          <TableCell style={tableCellStyle}>
            {formatPhoneNumber(data.phone_number)}
          </TableCell>
          {/* ~~~~~~~~~ ADDITIONAL DETAILS ~~~~~~~~~ */}
          <TableCell
            style={{
              ...tableCellStyle,
              minWidth: 200,
              maxWidth: 200,
            }}
          >
            {data.additional_details ? (
              <>{capitalizeFirstWord(data.additional_details)}</>
            ) : (
              "None Entered"
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
