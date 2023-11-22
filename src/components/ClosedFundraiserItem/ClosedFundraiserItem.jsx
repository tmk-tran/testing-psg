//Imports used for function
import React from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { TableCell, TableRow, Typography, Button } from "@mui/material";
import "./ClosedFundraiserItem.css"
//Function to render the component, takes in the fundraiser prop
export default function ClosedFundraiserItem({ fundraiser }) {
    //Instanciates dispatch for use
    const dispatch = useDispatch();
    //Function to format the data without the timestamp
    const formatDate = (dateString) => {
        if (!dateString) {
            return " ";
        }
        const date = new Date(dateString); // Assuming the date string is in 'YYYY-MM-DD' format
        const options = { year: "numeric", month: "long", day: "numeric" };
        return date.toLocaleDateString(undefined, options);
    };
    //Runs on click of the open button. Sends dispatch to reopen a fundraiser and notifies the user of the update
    const handleClick = () => {
        Swal.fire(
            'Updated!',
            'The fundraiser has been reopened.',
            'success'
        )
        dispatch({
            type: "OPEN_FUNDRAISER",
            payload: { id: Number(fundraiser.id), group_id: Number(fundraiser.group_id) }
        })
    }

    //Elements used in component, conditionally renders data if the fundraiser is set to closed
    return (
        <>
            {fundraiser.closed != false &&
                <TableRow className="closed_row" style={{ border: "2px solid black", padding: "0px" }}>
                    <TableCell className="closed_item_cell" ><Typography style={{ fontSize: "15px", width: "100px", textAlign: "center", padding: "0" }}>{fundraiser.title}</Typography></TableCell>
                    <TableCell className="closed_item_cell"><Typography style={{ fontSize: "15px", width: "100px", textAlign: "center" }}>{fundraiser.requested_book_quantity}</Typography></TableCell>
                    <TableCell className="closed_item_cell"><Typography style={{ fontSize: "15px", width: "100px", textAlign: "center" }}>{fundraiser.books_sold}</Typography></TableCell>
                    <TableCell className="closed_item_cell"><Typography style={{ fontSize: "15px", width: "100px", textAlign: "center" }}>${fundraiser.money_received}</Typography></TableCell>
                    <TableCell className="closed_item_cell"><Typography style={{ fontSize: "15px", width: "100px", textAlign: "center" }}>{formatDate(fundraiser.start_date)}</Typography></TableCell>
                    <TableCell className="closed_item_cell"><Typography style={{ fontSize: "15px", width: "100px", textAlign: "center" }}>{formatDate(fundraiser.end_date)}</Typography></TableCell>
                    <TableCell className="closed_item_cell"><Typography style={{ fontSize: "15px", width: "100px", textAlign: "center" }}>{fundraiser.year}</Typography></TableCell>
                    <TableCell className="closed_item_cell" style={{ textAlign: "center" }}><Typography style={{ fontSize: "15px", width: "100px", textAlign: "center" }}>${fundraiser.goal}</Typography></TableCell>
                    <TableCell className="closed_item_cell" style={{ textAlign: "center" }}><Typography style={{ fontSize: "15px", width: "100px", textAlign: "center" }}>${fundraiser.outstanding_balance}</Typography></TableCell>
                    <TableCell className="closed_item_cell" style={{ textAlign: "center" }}><Button style={{ margin: "2px" }} variant="contained" size="small" onClick={handleClick}><Typography style={{ fontSize: "12px" }}>Open</Typography></Button> </TableCell>
                </TableRow>
            }
        </>

    )
}