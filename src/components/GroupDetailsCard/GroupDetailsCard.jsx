//Imports used for component
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Modal,
  Typography,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { flexRowSpace } from "../Utils/pageStyles";

//Function for the component, takes in the group prop for use
export default function GroupDetailsCard({ group }) {
  //Instanciates history and dispatch for use in the component
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth)
  //Selector for the coupon books. Used to grab the year of the coupon book in the dropdown menu
  const couponBooks = useSelector((store) => store.couponBooks);
  console.log(couponBooks);
  //State used for the modal add fundraiser form
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //State used for the inputs in the modal add fundraiser form, set by on change eventes
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [booksRequested, setBooksRequested] = useState("");
  const [booksCheckedOut, setBooksCheckedOut] = useState("");
  const [booksCheckedIn, setBooksCheckedIn] = useState(0);
  const [booksSold, setBooksSold] = useState(0);
  const [goal, setGoal] = useState("");
  const [moneyReceived, setMoneyRecieved] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [couponBookId, setCouponBookId] = useState("");

  useEffect(() => {
    dispatch({ type: "FETCH_COUPON_BOOKS", payload: auth });
  }, []);

  //Function that runs on click of the submit button in add fundraiser form. This creates a new objcet that is sent to the back end to be added to the database and resets the state of the inputs in the form and closes the modal. Also fires sweetalert to let user know that the fundraiser has been added.
  const submitFundraiser = (e) => {
    e.preventDefault;
    const newFundraiser = {
      group_id: group.id,
      title: title,
      description: description,
      requested_book_quantity: booksRequested,
      book_quantity_checked_out: booksCheckedOut,
      book_quantity_checked_in: booksCheckedIn,
      books_sold: booksSold,
      goal: goal,
      money_received: moneyReceived,
      start_date: startDate,
      end_date: endDate,
      coupon_book_id: couponBookId,
    };
    console.log(newFundraiser);
    Swal.fire(
      "Fundraiser Created!",
      "Your fundraiser has been created!",
      "success"
    );
    dispatch({ type: "ADD_FUNDRAISER", payload: {newFundraiser: newFundraiser, auth: auth} });
    setTitle("");
    setDescription("");
    setBooksRequested("");
    setBooksCheckedOut("");
    setBooksCheckedIn(0);
    setBooksSold(0);
    setGoal("");
    setMoneyRecieved(0);
    setStartDate("");
    setEndDate("");
    setCouponBookId("");
    setOpen(false);
  };

  //Style used for the modal
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  //Elements and data used in the component. Displays the group card and the add fundraiser modal
  return (
    <>
      <Card
        elevation={3}
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          paddingTop: "30px",
          paddingBottom: "30px",
          width: "500px",
          margin: "auto",
        }}
      >
        <CardMedia
          style={{ objectFit: "cover", margin: "auto" }}
          className="cardMedia"
          component="img"
          image={group.group_photo}
        />
        <div
          style={{ margin: "auto", textAlign: "center", marginBottom: "10px" }}
        >
          <Typography variant="h5">
            {group.department} {group.sub_department}
          </Typography>
          <Typography>{group.group_description}</Typography>
        </div>
        <div style={flexRowSpace}>
          <Button variant="outlined" onClick={() => history.goBack()}>
            <Typography style={{ fontSize: "15px" }}>Back</Typography>
          </Button>{" "}
          <Button variant="outlined" onClick={handleOpen}>
            <Typography style={{ fontSize: "15px" }}>Add Fundraiser</Typography>
          </Button>
        </div>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="group-details-modal"
        aria-describedby="displays group details"
      >
        <Box sx={style}>
          <Typography
            style={{
              textAlign: "center",
              fontFamily: "Telugu Sangam MN",
              fontWeight: "bold",
            }}
            variant="h5"
          >
            Add A Fundraiser
          </Typography>

          <form onSubmit={submitFundraiser}>
            <div>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={12}>
                  <TextField
                    required
                    style={{ margin: "5px" }}
                    fullWidth
                    label="Title"
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  ></TextField>
                </Grid>
              </Grid>
            </div>
            <div>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={12}>
                  <TextField
                    required
                    style={{ margin: "5px" }}
                    fullWidth
                    label="Description"
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></TextField>
                </Grid>
              </Grid>
            </div>
            <div>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    style={{ margin: "5px" }}
                    label="Books Requested"
                    type="text"
                    placeholder="Books Requested"
                    value={booksRequested}
                    onChange={(e) => setBooksRequested(e.target.value)}
                  ></TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    style={{ margin: "5px" }}
                    label="Books Checked Out"
                    type="number"
                    placeholder="Books Checked Out"
                    value={booksCheckedOut}
                    onChange={(e) => setBooksCheckedOut(e.target.value)}
                  ></TextField>
                </Grid>
              </Grid>
            </div>
            <div>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    style={{ margin: "5px" }}
                    label="Books Checked In"
                    type="number"
                    placeholder="Books Checked In"
                    value={booksCheckedIn}
                    onChange={(e) => setBooksCheckedIn(e.target.value)}
                  ></TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    style={{ margin: "5px" }}
                    label="Books Sold"
                    type="number"
                    placeholder="Books Sold"
                    value={booksSold}
                    onChange={(e) => setBooksSold(e.target.value)}
                  ></TextField>
                </Grid>
              </Grid>
            </div>
            <div>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    required
                    style={{ margin: "5px" }}
                    label="Goal"
                    type="number"
                    placeholder="Goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  ></TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    style={{ margin: "5px", marginRight: "0" }}
                    type="number"
                    label="Money Received"
                    value={moneyReceived}
                    onChange={(e) => setMoneyRecieved(e.target.value)}
                  ></TextField>
                </Grid>
              </Grid>
            </div>

            <div>
              <Grid
                container
                justifyContent="center"
                rowSpacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={12} style={{ textAlign: "center" }}>
                  <InputLabel
                    style={{
                      fontSize: "20px",
                      color: "black",
                      fontWeight: "bold",
                      fontFamily: "Telugu Sangam MN",
                      marginTop: "10px",
                      marginBottom: "-18px",
                    }}
                  >
                    Start and End Date:
                  </InputLabel>
                </Grid>
                <Grid item xs={5.8}>
                  <TextField
                    required
                    fullWidth
                    style={{ margin: "5px", marginLeft: "0" }}
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  ></TextField>
                </Grid>
                <Grid
                  item
                  xs={1}
                  style={{
                    textAlign: "center",
                    marginTop: "30px",
                    marginLeft: "-20px",
                    marginRight: "-20px",
                  }}
                >
                  to
                </Grid>
                <Grid item xs={5.8}>
                  <TextField
                    required
                    fullWidth
                    style={{ margin: "6px" }}
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  ></TextField>
                </Grid>
              </Grid>
            </div>
            <div>
              <Grid
                container
                justifyContent="center"
                rowSpacing={2}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={6} style={{ textAlign: "center" }}>
                  <InputLabel
                    style={{
                      fontSize: "20px",
                      color: "black",
                      fontWeight: "bold",
                      fontFamily: "Telugu Sangam MN",
                      marginTop: "10px",
                    }}
                  >
                    Coupon Book Year:
                  </InputLabel>
                  <Select
                    required
                    fullWidth
                    style={{ margin: "5px" }}
                    value={couponBookId}
                    onChange={(e) => setCouponBookId(e.target.value)}
                  >
                    <MenuItem value="" disabled>
                      Please Select A Coupon Book Year
                    </MenuItem>
                    {couponBooks.map((couponBook) => (
                      <MenuItem value={couponBook.id} key={couponBook.id}>
                        {couponBook.year}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </div>
            <Button
              style={{ margin: "5px" }}
              variant="outlined"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" style={{ margin: "5px" }}>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
}
