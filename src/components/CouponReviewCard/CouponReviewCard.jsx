import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// ~~~~~~~~~~ Style ~~~~~~~~~~ //
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { border, borderPrimaryColor } from "../Utils/colors";
// ~~~~~~~~~~ Component ~~~~~~~~~~ //
import CommentDisplay from "../CommentDisplay/CommentDisplay";
import FilePreview from "../CouponReviewDetails/FilePreview";
import CouponStatusDropdown from "../CouponStatusDropdown/CouponStatusDropdown";
import NoDetailsCard from "../NoDetailsCard/NoDetailsCard";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~ //
import { historyHook } from "../../hooks/useHistory";
import { dispatchHook } from "../../hooks/useDispatch";
import { mComments } from "../../hooks/reduxStore";
import { flexCenter, textCenter } from "../Utils/pageStyles";
import { grayBackground } from "../Utils/colors";
import { couponsData } from "../../hooks/reduxStore";
import { thumbnailSize } from "../CouponReviewDetails/FilePreview";
import { capitalizeFirstWord, capitalizeWords } from "../Utils/helpers";

const thumbnailHeaderStyle = {
  ...grayBackground,
  ...textCenter,
};

export default function CouponReviewCard({ merchant, onTaskUpdate }) {
  console.log(merchant);
  const mId = useParams();
  console.log(mId);
  const merchantId = mId.id;
  console.log(merchantId);

  const [isTaskUpdate, setIsTaskUpdate] = useState(false);
  console.log(isTaskUpdate);
  const [changesRequested, setChangesRequested] = useState(false);
  console.log(changesRequested);
  const [completedCoupon, setCompletedCoupon] = useState(false);
  console.log(completedCoupon);

  const dispatch = dispatchHook();
  const history = historyHook();

  useEffect(() => {
    dispatch({
      type: "FETCH_MERCHANT_COMMENTS",
      payload: merchantId,
    });
    merchantId &&
      dispatch({
        type: "FETCH_PDF_FILE",
        payload: merchantId,
      });
  }, []);

  const files = couponsData() || [];
  console.log(files);
  const merchantComments = mComments(merchantId);
  console.log(merchantComments);
  const mostRecentComment =
    merchantComments.length > 0 ? merchantComments[0] : null;
  console.log(mostRecentComment);

  const handleUpdateClick = (event) => {
    // Add your logic for the Update button click
    onTaskUpdate();

    // Prevent the click event from propagating to the Card and triggering history.push
    event.stopPropagation();
  };

  const handleContainerClick = (event) => {
    // Prevent the click event from propagating to the Card and triggering history.push
    event.stopPropagation();
  };

  const handleUpdateTask = (choice) => {
    console.log(choice);
    setIsTaskUpdate(true);
  };

  const handleChangeRequest = (newValue) => {
    // setChangesRequested(newValue);
    console.log("Changes requested: ", changesRequested);
  };

  const handleCompletedCoupon = () => {
    // setCompletedCoupon(true);
    console.log("Completed coupon: ", completedCoupon);
  };

  const handleCardClick = (couponId) => {
    console.log(couponId);
    history.push({
      pathname: `/coupon/${merchantId}/${couponId}`,
    });
  };

  return (
    <>
      {files.length > 0 ? (
        files.map((file, i) => (
          <Card
            key={i}
            elevation={3}
            sx={{ "&:hover": { cursor: "pointer", transform: "scale(1.03)" } }}
            onClick={() => {
              handleCardClick(file.id);
            }}
          >
            <CardContent>
              {/* <SuccessAlert isOpen={isAlertOpen} onClose={handleAlertClose} /> */}
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
                {/* Need to add onChange prop here to resolve error */}
                <CouponStatusDropdown
                  handleUpdateTask={handleUpdateTask}
                  onChange={handleChangeRequest}
                  complete={handleCompletedCoupon}
                />

                <Button sx={{ marginLeft: "10px" }} onClick={handleUpdateClick}>
                  Update
                </Button>
              </div>
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

              <hr />

              <div style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                {/* REMOVE BORDERS AND PLACEHOLDERS UPON HOOKUP TO DB ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~ FRONT OF COUPON ~~~~~~ */}
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                <div style={borderPrimaryColor}>
                  <Typography variant="body2" sx={thumbnailHeaderStyle}>
                    Front
                  </Typography>
                  <FilePreview
                    directFile={file}
                    showFrontViewFiles={true}
                    showBackViewFiles={false}
                    caseType="preview"
                  />
                </div>
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~ BACK OF COUPON ~~~~~~~ */}
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                <div style={borderPrimaryColor}>
                  <Typography variant="body2" sx={thumbnailHeaderStyle}>
                    Back
                  </Typography>
                  <FilePreview
                    directFile={file}
                    showFrontViewFiles={false}
                    showBackViewFiles={true}
                    caseType="preview"
                  />
                </div>
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~ COUPON DETAILS ~~~~~~~ */}
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                <div style={borderPrimaryColor}>
                  <Typography variant="body2" sx={thumbnailHeaderStyle}>
                    Offer: 
                  </Typography>
                  <div style={{ ...thumbnailSize, ...flexCenter }}>
                    {file.offer ? (
                      <Typography variant="body2" sx={{ fontWeight: "bold", p: 1, ...textCenter }}>
                        {/* Details of Coupon */}
                        {capitalizeWords(file.offer)}
                      </Typography>
                    ) : (
                      <Typography variant="caption">No offer set</Typography>
                    )}
                  </div>
                </div>
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {/* ~~~~~~~~~ COMMENTS ~~~~~~~~~~ */}
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                <Box sx={{ mt: 5, p: .5, mr: 1 }}>
                  <CommentDisplay comment={mostRecentComment} />
                </Box>
                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <NoDetailsCard label="Coupons empty" />
      )}
    </>
  );
}
