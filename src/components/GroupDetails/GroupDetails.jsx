//Imports used in component
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Typography,
  Container,
  CardContent,
  Paper,
} from "@mui/material";
//Imports used for tables and data
import GroupDetailsCard from "../GroupDetailsCard/GroupDetailsCard";
import ActiveFundraiserItem from "../ActiveFundraiserItem/ActiveFundraiserItem";
import ClosedFundraiserItem from "../ClosedFundraiserItem/ClosedFundraiserItem";
import "./GroupDetails.css";

//Function for the component
export default function GroupDetails() {
  //Used to get the group id number and display the correct fundraiser information
  const id = Number(useParams().id);
  //Instanciates dispatch for use in component
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth);
  //Store used to get the group and fundraiser data
  const groupDetails = useSelector((store) => store.group);
  const fundraisers = useSelector((store) => store.fundraisers);

  // Define custom typography styles
  const bold16px = {
    fontSize: "16px",
    fontWeight: "bold",
    // padding: "0",
    textAlign: "center",
  };

  // Style including width for actions header
  const bold16pxWithWidth = {
    ...bold16px,
    width: "137px",
  };

  // Table Cell Style
  const tableCellStyle = {
    width: "0px",
    padding: "2px",
  };

  //Use Effect that runs on page load to fetch the group details
  useEffect(() => {
    dispatch({ type: "FETCH_GROUP_DETAILS", payload: {id: id, auth: auth} });
  }, []);
  //Use Effect that runs after group details are fetched. Grabs the fundraisers tied to the group id number
  useEffect(() => {
    dispatch({ type: "FETCH_FUNDRAISERS", payload: {id: id, auth: auth} });
  }, [groupDetails]);
  //Console logs for testing
  console.log(groupDetails);
  console.log(fundraisers);

  //Elements used in component. Displays data based on the components that are called and has the headers for both open fundraisers and closed fundarisers tables
  return (
    <>
      <Container>
        <br />
        {groupDetails.map((group) => {
          return <GroupDetailsCard key={id} group={group} />;
        })}
      </Container>
      <br />
      <br />
      <Paper
        elevation={6}
        style={{
          margin: "10px",
          padding: "10px",
          paddingBottom: "40px",
          height: "80%",
        }}
      >
        <TableContainer style={{ width: "95%", margin: "auto" }}>
          <Typography variant="h6">Active Campaigns </Typography>
          <Table size="small" className="active-table">
            <TableHead>
              <TableRow style={{ border: "2px solid black" }}>
                <TableCell
                  style={tableCellStyle}
                  className="active_header_cell"
                >
                  <Typography style={bold16px}>Title</Typography>
                </TableCell>
                <TableCell
                  style={tableCellStyle}
                  className="active_header_cell"
                >
                  <Typography style={bold16px}>Books Requested</Typography>
                </TableCell>
                <TableCell
                  style={tableCellStyle}
                  className="active_header_cell"
                >
                  <Typography style={bold16px}>Books Checked Out</Typography>
                </TableCell>
                <TableCell
                  style={tableCellStyle}
                  className="active_header_cell"
                >
                  <Typography style={bold16px}>Books Out Value</Typography>
                </TableCell>
                <TableCell
                  style={tableCellStyle}
                  className="active_header_cell"
                >
                  <Typography style={bold16px}>Books Checked In</Typography>
                </TableCell>
                <TableCell
                  style={tableCellStyle}
                  className="active_header_cell"
                >
                  <Typography style={bold16px}>Books Sold</Typography>
                </TableCell>
                <TableCell className="active_header_cell">
                  <Typography style={bold16px}>Money Received</Typography>
                </TableCell>

                <TableCell className="active_header_cell">
                  <Typography style={bold16px}>Group Earnings</Typography>
                </TableCell>

                <TableCell className="active_header_cell">
                  <Typography style={bold16px}>PSG Earnings</Typography>
                </TableCell>
                <TableCell className="active_header_cell">
                  <Typography style={bold16px}>Start and End Date</Typography>
                </TableCell>
                <TableCell
                  style={{ width: "0px", padding: "2px" }}
                  className="active_header_cell"
                >
                  <Typography style={bold16px}>Year</Typography>
                </TableCell>
                <TableCell
                  style={{ width: "0px", padding: "2px" }}
                  className="active_header_cell"
                >
                  <Typography style={bold16px}>Goal</Typography>
                </TableCell>
                <TableCell
                  style={tableCellStyle}
                  className="active_header_cell"
                >
                  <Typography style={bold16px}>Outstanding Balance</Typography>
                </TableCell>
                <TableCell className="active_header_cell">
                  <Typography style={bold16pxWithWidth}>Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fundraisers.map((fundraiser) => {
                return (
                  <ActiveFundraiserItem
                    key={fundraiser.id}
                    fundraiser={fundraiser}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <br />
        <TableContainer style={{ width: "95%", margin: "auto" }}>
          <Typography variant="h6">Closed Campaigns</Typography>
          <Table size="small">
            <TableHead>
              <TableRow style={{ border: "2px solid black", width: "80%" }}>
                <TableCell
                  className="active_header_cell"
                  style={{ width: "20px" }}
                >
                  <Typography style={bold16px}>Title</Typography>
                </TableCell>
                <TableCell
                  className="active_header_cell"
                  style={{ width: "10px" }}
                >
                  <Typography style={bold16px}>Books Requested</Typography>
                </TableCell>
                <TableCell
                  className="active_header_cell"
                  style={{ width: "10px" }}
                >
                  <Typography style={bold16px}>Books Sold</Typography>
                </TableCell>
                <TableCell
                  className="active_header_cell"
                  style={{ width: "10px" }}
                >
                  <Typography style={bold16px}>Money Received</Typography>
                </TableCell>

                <TableCell className="active_header_cell">
                  <Typography style={bold16px}>
                    Group Earnings
                  </Typography>
                </TableCell>

                <TableCell
                  className="active_header_cell"
                  style={{ width: "10px" }}
                >
                  <Typography style={bold16px}>Start Date</Typography>
                </TableCell>
                <TableCell
                  className="active_header_cell"
                  style={{ width: "10px" }}
                >
                  <Typography style={bold16px}>End Date</Typography>
                </TableCell>
                <TableCell
                  className="active_header_cell"
                  style={{ width: "10px" }}
                >
                  <Typography style={bold16px}>Year</Typography>
                </TableCell>
                <TableCell
                  className="active_header_cell"
                  style={{ width: "10px" }}
                >
                  <Typography style={bold16px}>Goal</Typography>
                </TableCell>
                <TableCell
                  className="active_header_cell"
                  style={{ width: "10px" }}
                >
                  <Typography style={bold16px}>Outstanding Balance</Typography>
                </TableCell>
                <TableCell
                  className="active_header_cell"
                  style={{ width: "10px" }}
                >
                  <Typography style={bold16px}>Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fundraisers.map((fundraiser) => {
                return (
                  <ClosedFundraiserItem
                    key={fundraiser.id}
                    fundraiser={fundraiser}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
