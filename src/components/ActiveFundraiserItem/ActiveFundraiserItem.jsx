//Imports used in the component
import React, { useState } from "react";
import {
  Button,
  OutlinedInput,
  TableCell,
  TableRow,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import "./ActiveFundraiserItem.css";
//Function for the component
export default function ActiveFundraiserItem({ fundraiser }) {
  //Instanciates dispatch for use in component
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth);
  //State used to update fundraiser information
  let [booksSold, setBooksSold] = useState(fundraiser.books_sold);
  let [booksCheckedOut, setBooksCheckedOut] = useState(
    fundraiser.book_quantity_checked_out
  );
  // let [booksCheckedOut, setBooksCheckedOut] = useState(
  //   fundraiser.requested_book_quantity - fundraiser.book_quantity_checked_in
  // );
  let [booksCheckedIn, setBooksCheckedIn] = useState(
    fundraiser.book_quantity_checked_in
  );
  let [moneyReceived, setMoneyRecieved] = useState(fundraiser.money_received);
  let [goal, setGoal] = useState(fundraiser.goal);
  let [editMode, setEditMode] = useState(false);
  let [editTitle, setEditTitle] = useState(fundraiser.title);

  //Function that formats the date and removes the timestamp
  const formatDate = (dateString) => {
    if (!dateString) {
      return " ";
    }
    const date = new Date(dateString); // Assuming the date string is in 'YYYY-MM-DD' format
    const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
    return date.toLocaleDateString(undefined, options);
  };

  //Function that runs when the update button is clicked. Builds a new object with the updated data and sends it to the back end to be updated in the database. Also fires off a sweetalert to let user know that the fundraiser has been updated.
  const updateAmount = () => {
    const updatedAmount = {
      id: Number(fundraiser.id),
      title: editTitle,
      description: fundraiser.description,
      requested_book_quantity: fundraiser.requested_book_quantity,
      newBooksSold: Number(booksSold),
      newBooksCheckedOut: Number(booksCheckedOut),
      newBooksCheckedIn: Number(booksCheckedIn),
      newMoneyReceived: Number(moneyReceived),
      newGoal: Number(goal),
      group_id: Number(fundraiser.group_id),
      coupon_book_id: fundraiser.coupon_book_id,
      start_date: fundraiser.start_date,
      end_date: fundraiser.end_date
    };
    Swal.fire(
      "Updated!",
      "The fundraiser amounts have been updated.",
      "success"
    );
    dispatch({ type: "UPDATE_FUNDRAISER_AMOUNTS", payload: {updatedAmount: updatedAmount, auth: auth} });
    setEditMode(false);
  };
  //Function that runs on click of close button. A sweetalert will pop up prompting the user to confirm that the fundraiser is to be closed. Will then send the dispatch and payload to update a fundraiser to closed.
  const handleCloseFundraiser = () => {
    const closedFundraiser = {id: Number(fundraiser.id),
      group_id: Number(fundraiser.group_id),
      title: fundraiser.title,
      description: fundraiser.description,
      requested_book_quantity: fundraiser.requested_book_quantity,
      book_quantity_checked_out: fundraiser.book_quantity_checked_out,
      book_quantity_checked_in: fundraiser.book_quantity_checked_in,
      books_sold: fundraiser.books_sold,
      money_received: fundraiser.money_received,
      start_date: fundraiser.start_date,
      end_date: fundraiser.end_date,
      coupon_book_id: fundraiser.coupon_book_id,
      goal: fundraiser.goal,
      closed: true}
    Swal.fire({
      title: "Are you sure?",
      text: "This fundraiser will be closed.",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Closed!", "The fundraiser has been closed.", "success");
        dispatch({
          type: "CLOSE_FUNDRAISER",
          payload: {closedFundraiser: closedFundraiser, auth: auth},
        });
      }
    });
  };

  //Elements used in this component. Conditionally renders the table based on edit mode state and if the fundraiser is currently closed or active
  return (
    <>
      {editMode === true ? (
        <>
          {fundraiser.closed != true && (
            <TableRow
              className="active_row"
              style={{ border: "2px solid black", height: "80px" }}
            >
              <TableCell
                TableCell
                style={{
                  width: "50px",
                  border: "2px solid black",
                  padding: "0",
                }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    width: "88px",
                    textAlign: "center",
                  }}
                >
                  <OutlinedInput
                    style={{ fontSize: "15px", width: "80px", height: "25px" }}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  >
                    {fundraiser.title}
                  </OutlinedInput>
                </Typography>
              </TableCell>
              <TableCell style={{ width: "50px", border: "2px solid black" }}>
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  {fundraiser.requested_book_quantity}
                </Typography>
              </TableCell>
              <TableCell
                style={{
                  width: "50px",
                  border: "2px solid black",
                  padding: "0",
                }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  <OutlinedInput
                    style={{ fontSize: "15px", width: "60px", height: "25px" }}
                    value={booksCheckedOut}
                    onChange={(e) => setBooksCheckedOut(e.target.value)}
                  >
                    {fundraiser.book_quantity_checked_out}
                  </OutlinedInput>
                </Typography>
              </TableCell>
              <TableCell style={{ width: "50px", border: "2px solid black" }}>
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  ${fundraiser.book_checked_out_total_value}
                </Typography>
              </TableCell>
              <TableCell
                style={{
                  width: "50px",
                  border: "2px solid black",
                  padding: "0",
                }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  <OutlinedInput
                    style={{ fontSize: "15px", width: "60px", height: "25px" }}
                    value={booksCheckedIn}
                    onChange={(e) => setBooksCheckedIn(e.target.value)}
                  >
                    {fundraiser.book_quantity_checked_in}
                  </OutlinedInput>
                  {/* <OutlinedInput
                    style={{ fontSize: "15px", width: "60px", height: "25px" }}
                    value={booksCheckedIn}
                    onChange={(e) => {
                      const newBooksCheckedIn = e.target.value;
                      setBooksCheckedIn(newBooksCheckedIn);

                      // Update booksCheckedOut based on the new value of booksCheckedIn
                      const newBooksCheckedOut =
                        fundraiser.requested_book_quantity - newBooksCheckedIn;
                      setBooksCheckedOut(newBooksCheckedOut);
                    }}
                  /> */}
                </Typography>
              </TableCell>
              <TableCell
                style={{
                  width: "50px",
                  border: "2px solid black",
                  padding: "0",
                }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  <OutlinedInput
                    style={{ fontSize: "15px", width: "60px", height: "25px" }}
                    value={booksSold}
                    onChange={(e) => setBooksSold(e.target.value)}
                  >
                    {fundraiser.books_sold}
                  </OutlinedInput>
                </Typography>
              </TableCell>
              <TableCell
                style={{
                  width: "50px",
                  border: "2px solid black",
                  padding: "0",
                }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  <OutlinedInput
                    style={{ fontSize: "15px", width: "62px", height: "25px" }}
                    value={moneyReceived}
                    onChange={(e) => setMoneyRecieved(e.target.value)}
                  >
                    {fundraiser.money_received}
                  </OutlinedInput>
                </Typography>
              </TableCell>

              {/* Group Earnings */}
              <TableCell
                TableCell
                style={{ width: "50px", border: "2px solid black" }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  ${fundraiser.books_sold * fundraiser.group.organization.organization_earnings}
                </Typography>
              </TableCell>

              {/* PSG Earnings */}
              <TableCell
                TableCell
                style={{ width: "50px", border: "2px solid black" }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  $
                  {(fundraiser.books_sold * 25) -
                    (fundraiser.books_sold * fundraiser.organization_earnings)}
                </Typography>
              </TableCell>
              <TableCell style={{ width: "50px", border: "2px solid black" }}>
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  {formatDate(fundraiser.start_date)} to{" "}
                  {formatDate(fundraiser.end_date)}
                </Typography>
              </TableCell>
              <TableCell style={{ width: "50px", border: "2px solid black" }}>
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  {fundraiser.coupon_book.year}
                </Typography>
              </TableCell>
              <TableCell
                style={{
                  width: "50px",
                  border: "2px solid black",
                  padding: "0",
                }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  <OutlinedInput
                    style={{ fontSize: "15px", width: "62px", height: "25px" }}
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  >
                    {fundraiser.goal}
                  </OutlinedInput>
                </Typography>
              </TableCell>

              {/* Need to visit SQL logic for outstanding_balance */}
              <TableCell style={{ width: "50px", border: "2px solid black" }}>
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  ${fundraiser.outstanding_balance}
                </Typography>
              </TableCell>
              <TableCell
                style={{
                  width: "120px",
                  border: "2px solid black",
                  textAlign: "center",
                }}
              >
                <Button
                  style={{
                    marginRight: "7px",
                    backgroundColor: "red",
                    fontSize: "11px",
                  }}
                  variant="contained"
                  size="small"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
                <Button
                  style={{ marginLeft: "7px", fontSize: "11px" }}
                  variant="contained"
                  size="small"
                  onClick={updateAmount}
                >
                  Save
                </Button>
              </TableCell>
            </TableRow>
          )}
        </>
      ) : (
        <>
          {fundraiser.closed != true && (
            <TableRow
              className="active_row"
              style={{ border: "2px solid black", height: "80px" }}
            >
              <TableCell style={{ width: "50px", border: "2px solid black" }}>
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  {fundraiser.title}
                </Typography>
              </TableCell>
              <TableCell
                TableCell
                style={{ width: "50px", border: "2px solid black" }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  {fundraiser.requested_book_quantity}
                </Typography>
              </TableCell>
              <TableCell
                TableCell
                style={{ width: "50px", border: "2px solid black" }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  {booksCheckedOut}
                </Typography>
              </TableCell>
              <TableCell
                TableCell
                style={{ width: "50px", border: "2px solid black" }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  ${fundraiser.book_checked_out_total_value}
                </Typography>
              </TableCell>
              <TableCell
                TableCell
                style={{ width: "50px", border: "2px solid black" }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  {fundraiser.book_quantity_checked_in}
                </Typography>
              </TableCell>
              <TableCell
                TableCell
                style={{ width: "50px", border: "2px solid black" }}
              >
                {" "}
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  {fundraiser.books_sold}
                </Typography>
              </TableCell>
              <TableCell
                TableCell
                style={{ width: "50px", border: "2px solid black" }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  ${fundraiser.money_received}
                </Typography>
              </TableCell>

              {/* Group Earnings */}
              <TableCell
                TableCell
                style={{ width: "50px", border: "2px solid black" }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  ${fundraiser.books_sold * fundraiser.group.organization.organization_earnings}
                </Typography>
              </TableCell>

              {/* PSG Earnings */}
              <TableCell
                TableCell
                style={{ width: "50px", border: "2px solid black" }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  $
                  {(fundraiser.books_sold * 25) -
                    (fundraiser.books_sold * fundraiser.group.organization.organization_earnings)}
                </Typography>
              </TableCell>
              <TableCell style={{ width: "50px", border: "2px solid black" }}>
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  {formatDate(fundraiser.start_date)} to{" "}
                  {formatDate(fundraiser.end_date)}
                </Typography>
              </TableCell>
              <TableCell
                TableCell
                style={{ width: "50px", border: "2px solid black" }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  {fundraiser.coupon_book.year}
                </Typography>
              </TableCell>
              <TableCell
                style={{
                  width: "50px",
                  border: "2px solid black",
                  backgroundColor:
                    fundraiser.money_received >= fundraiser.goal
                      ? "#b4e2b4"
                      : "transparent",
                }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  ${fundraiser.goal}
                </Typography>
              </TableCell>

              <TableCell
                style={{
                  width: "50px",
                  border: "2px solid black",
                  backgroundColor:
                    fundraiser.outstanding_balance > 0
                      ? "#E3A29B"
                      : "transparent",
                }}
              >
                <Typography
                  style={{
                    fontSize: "15px",
                    textAlign: "center",
                    padding: "0",
                  }}
                >
                  ${fundraiser.outstanding_balance}
                </Typography>
              </TableCell>
              <TableCell
                style={{
                  width: "120px",
                  border: "2px solid black",
                  textAlign: "center",
                }}
              >
                {" "}
                <Button
                  style={{
                    marginRight: "7px",
                    backgroundColor: "red",
                    fontSize: "11px",
                  }}
                  variant="contained"
                  size="small"
                  onClick={handleCloseFundraiser}
                >
                  Close
                </Button>
                <Button
                  style={{ marginLeft: "7px", fontSize: "11px" }}
                  variant="contained"
                  onClick={() => setEditMode(true)}
                >
                  <Typography style={{ marginLeft: "3px", fontSize: "11px" }}>
                    Edit
                  </Typography>
                </Button>{" "}
              </TableCell>
            </TableRow>
          )}
        </>
      )}
    </>
  );
}