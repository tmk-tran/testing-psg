import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// ~~~~~~~~~~ Style ~~~~~~~~~~
import { Button, Card, CardContent, Typography } from "@mui/material";
import { border } from "../Utils/colors";
// ~~~~~~~~~~ Component ~~~~~~~~~~
import CommentDisplay from "../CommentDisplay/CommentDisplay";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { historyHook } from "../../hooks/useHistory";
import CouponStatusDropdown from "../CouponStatusDropdown/CouponStatusDropdown";
import { dispatchHook } from "../../hooks/useDispatch";
import { mComments } from "../../hooks/reduxStore";

export default function CouponReviewCard({ merchant }) {
  console.log(merchant);
  const mId = useParams();
  console.log(mId);
  const merchantId = mId.id;
  console.log(merchantId);

  const dispatch = dispatchHook();
  const history = historyHook();

  useEffect(() => {
    dispatch({
      type: "FETCH_MERCHANT_COMMENTS",
      payload: merchantId,
    });
  }, []);

  const merchantComments = mComments(merchantId);
  console.log(merchantComments);

  const handleUpdateClick = (event) => {
    // Add your logic for the Update button click
    // ...

    // Prevent the click event from propagating to the Card and triggering history.push
    event.stopPropagation();
  };

  const handleContainerClick = (event) => {
    // Prevent the click event from propagating to the Card and triggering history.push
    event.stopPropagation();
  };

  return (
    <Card
      elevation={6}
      className="details-view-card"
      onClick={() => {
        history.push(`/coupon/${1}`);
      }}
      // sx={{ height: "80%" }}
    >
      <CardContent>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~ HEADER ~~~~~~~~~~~ */}
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "20px",
          }}
          onClick={handleContainerClick}
        >
          {/* Status Menu */}
          <CouponStatusDropdown />

          <Button sx={{ marginLeft: "10px" }} onClick={handleUpdateClick}>
            Update
          </Button>
        </div>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

        <hr />

        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          {/* REMOVE BORDERS AND PLACEHOLDERS UPON HOOKUP TO DB ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~ FRONT OF COUPON ~~~~~~ */}
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* <div style={border}> */}
          <div>
            <div
              style={{
                height: "15vh",
                backgroundColor: "#D9D9D9",
              }}
            >
              <Typography sx={{ textAlign: "center", lineHeight: "15vh" }}>
                Front of Coupon
              </Typography>
            </div>
          </div>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~ BACK OF COUPON ~~~~~~~ */}
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* <div style={border}> */}
          <div>
            <div
              style={{
                height: "15vh",
                backgroundColor: "#D9D9D9",
              }}
            >
              <Typography sx={{ textAlign: "center", lineHeight: "15vh" }}>
                Back of Coupon
              </Typography>
            </div>
          </div>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~ COUPON DETAILS ~~~~~~~ */}
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* <div style={border}> */}
          <div>
            <div
              style={{
                height: "10vh",
                backgroundColor: "rgba(96, 96, 96, 0.1)",
              }}
            >
              <Typography
                variant="body2"
                sx={{ textAlign: "center", lineHeight: "10vh" }}
              >
                Details of Coupon
              </Typography>
            </div>
          </div>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ~~~~~~~~~ COMMENTS ~~~~~~~~~~ */}
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          <div style={{ padding: "5%" }}>
            {merchantComments.map((comment, i) => (
              <CommentDisplay key={i} comment={comment} />
            ))}
          </div>
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        </div>
      </CardContent>
    </Card>
  );
}
