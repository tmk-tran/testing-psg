import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import { Typography, Card, CardContent, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { border } from "../Utils/colors";
// ~~~~~~~~~~ Components ~~~~~~~~~~
import DenyProofModal from "../DenyProofModal/DenyProofModal";
import CouponStatusDropdown from "../CouponStatusDropdown/CouponStatusDropdown";
import CouponReviewButtons from "./CouponReviewButtons";
import CouponReviewComments from "./CouponReviewComments";
import BackButton from "../Buttons/BackButton";
import FilePreview from "./FilePreview";     
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { dispatchHook } from "../../hooks/useDispatch";
import { pdfFile } from "../../hooks/reduxStore";

export default function CouponReviewDetails() {
  const dispatch = dispatchHook();
  const params = useParams();
  console.log(params.id);
  const merchantId = params.id;
  console.log(merchantId);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskUpdate, setIsTaskUpdate] = useState(false);
  console.log(isTaskUpdate);
  const [commentAdded, setCommentAdded] = useState(false);
  console.log(commentAdded);
  const [changesRequested, setChangesRequested] = useState(false);
  console.log(changesRequested);
  const [completedCoupon, setCompletedCoupon] = useState(false);
  console.log(completedCoupon);
  const [uploadedFiles, setUploadedFiles] = useState(false);
  console.log(uploadedFiles);

  const handleDenyButtonClick = () => {
    // Open the modal when Deny button is clicked
    setIsModalOpen(true);
  };

  const handleUpdateTask = (choice) => {
    console.log(choice);
    setIsTaskUpdate(true);
  };

  const updateTaskState = (newValue) => {
    setIsTaskUpdate(newValue);
  };

  const updateComments = () => {
    setCommentAdded(true);
  };

  const handleChangeRequest = (newValue) => {
    setChangesRequested(newValue);
    console.log("Changes requested: ", changesRequested);
  };

  const handleCompletedCoupon = () => {
    setCompletedCoupon(true);
    console.log("Completed coupon: ", completedCoupon);
  };

  const handleUploadFile = () => {
    setUploadedFiles(true);
  };

  const couponId = 6;
  console.log(couponId);

  useEffect(() => {
    // Ensure that merchantId is available before dispatching the action
    if (merchantId) {
      dispatch({ type: "FETCH_MERCHANT_COMMENTS", payload: merchantId });
    }
    dispatch({ type: "FETCH_COUPON_FILES", payload: merchantId });
    setUploadedFiles(false);
  }, [merchantId, commentAdded, uploadedFiles]); //Deleted dispatch from dependencies

  const files = pdfFile() || [];
  console.log(files);

  return (
    <div className={`details-container ${isSmallScreen ? "small-screen" : ""}`}>
      <Card className="details-card" elevation={3}>
        <CardContent>
          <div className="detailsView-container">
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              {/* ~~~~~~~~~~ BACK BUTTON ~~~~~~~~~~ */}
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              <BackButton />
              {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  flexGrow: 1,
                }}
              >
                Coupon Details
              </Typography>
            </div>

            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            <Card
              style={{ width: "50vw", height: "64vh", margin: "0 auto" }}
              elevation={3}
            >
              <CardContent>
                <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                  <div style={{ width: "25vw" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 15,
                      }}
                    >
                      <div>
                        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                        {/* ~~~~~~~~~ FRONT OF COUPON ~~~~~~~ */}
                        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                        <div
                          style={{
                            height: "18vh",
                            backgroundColor: "#D9D9D9",
                          }}
                        >
                          <Typography
                            sx={{ textAlign: "center", lineHeight: "15vh" }}
                          >
                            Front of Coupon
                          </Typography>
                        </div>
                        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      </div>

                      <div>
                        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                        {/* ~~~~~~~~~ BACK OF COUPON ~~~~~~~~ */}
                        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                        <div
                          style={{
                            height: "18vh",
                            backgroundColor: "#D9D9D9",
                          }}
                        >
                          <Typography
                            sx={{ textAlign: "center", lineHeight: "15vh" }}
                          >
                            Back of Coupon
                          </Typography>
                        </div>
                        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      </div>

                      <div>
                        <div
                          style={{
                            height: "15vh",
                            backgroundColor: "rgba(96, 96, 96, 0.1)",
                          }}
                        >
                          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                          {/* ~~~~~~~~~~~~ STATUS ~~~~~~~~~~~~~ */}
                          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                          <CouponStatusDropdown
                            handleUpdateTask={handleUpdateTask}
                            onChange={handleChangeRequest}
                            complete={handleCompletedCoupon}
                          />
                          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

                          <Typography
                            variant="body2"
                            sx={{ textAlign: "center", mt: 2 }}
                          >
                            Details of Coupon
                          </Typography>
                        </div>
                      </div>
                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~~ BUTTONS ~~~~~~~~~~~~~ */}
                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                      <CouponReviewButtons
                        onDenyButtonClick={handleDenyButtonClick}
                        isTaskUpdate={isTaskUpdate}
                        updateTaskState={updateTaskState}
                        changesRequested={changesRequested}
                        completedCoupon={completedCoupon}
                      />
                      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

                      {isModalOpen && (
                        <DenyProofModal onClose={() => setIsModalOpen(false)} />
                      )}
                    </div>
                  </div>
                  {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                  {/* ~~~~~~~~~~~~ COMMENTS ~~~~~~~~~~~ */}
                  {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                  <CouponReviewComments
                    merchantId={merchantId}
                    onSubmit={updateComments}
                    files={files}
                    handleUploadFile={handleUploadFile}
                  />
                  {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

                </div>
              </CardContent>
            </Card>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
