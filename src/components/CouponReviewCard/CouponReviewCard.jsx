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
import { mComments, mTasks } from "../../hooks/reduxStore";
import { flexCenter, textCenter } from "../Utils/pageStyles";
import { grayBackground } from "../Utils/colors";
import { couponsData } from "../../hooks/reduxStore";
import { thumbnailSize } from "../CouponReviewDetails/FilePreview";
import { capitalizeFirstWord, capitalizeWords } from "../Utils/helpers";
import { showSaveSweetAlert } from "../Utils/sweetAlerts";

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

  const [couponId, setCouponId] = useState("");
  console.log(couponId);
  const [taskUpdate, setTaskUpdate] = useState("");
  console.log(taskUpdate);
  const [taskStatus, setTaskStatus] = useState("");
  console.log(taskStatus);
  const [newTaskStatus, setNewTaskStatus] = useState("");
  console.log(newTaskStatus);
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
    // dispatch({
    //   type: "FETCH_MERCHANT_TASKS",
    //   payload: merchantId,
    // });
  }, [merchantId]);

  const files = couponsData() || [];
  console.log(files);
  const merchantComments = mComments(merchantId);
  console.log(merchantComments);
  const mostRecentComment =
    merchantComments.length > 0 ? merchantComments[0] : null;
  console.log(mostRecentComment);
  const tasks = mTasks() || [];
  console.log(tasks);

  const handleUpdateClick = (event) => {
    // Prevent the click event from propagating to the Card and triggering history.push
    event.stopPropagation();

    const dispatchAction = newTaskStatus
      ? {
          type: "UPDATE_MERCHANT_TASK",
          payload: {
            id: couponId,
            task: newTaskStatus,
            task_status: taskStatus,
            merchantId: merchantId,
          },
        }
      : null;

    // Log the dispatch action if it is defined
    if (dispatchAction) {
      console.log("Dispatch Action:", dispatchAction);
      dispatch(dispatchAction);
    }

    // onTaskUpdate();
    showSaveSweetAlert({ label: "Task Updated" });
  };

  const handleContainerClick = (event) => {
    // Prevent the click event from propagating to the Card and triggering history.push
    event.stopPropagation();
  };

  const handleUpdateTask = (couponId, choice, taskStatus) => {
    console.log(couponId);
    console.log(choice);
    console.log(taskStatus);
    setCouponId(couponId);
    setNewTaskStatus(choice);
    setTaskStatus(taskStatus);
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
        files.map((file, i) => {
          const couponTask = tasks.find((task) => task.coupon_id === file.id);
          return (
            <Card
              key={i}
              elevation={3}
              sx={{
                "&:hover": { cursor: "pointer", transform: "scale(1.03)" },
              }}
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
                    task={couponTask}
                    handleUpdateTask={handleUpdateTask}
                    onChange={handleChangeRequest}
                    complete={handleCompletedCoupon}
                  />

                  <Button
                    sx={{ marginLeft: "10px" }}
                    onClick={handleUpdateClick}
                  >
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
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", p: 1, ...textCenter }}
                        >
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
                  <Box sx={{ mt: 5, p: 0.5, mr: 1 }}>
                    <CommentDisplay comment={mostRecentComment} />
                  </Box>
                  {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <NoDetailsCard label="Coupons empty" />
      )}
    </>
  );
}
