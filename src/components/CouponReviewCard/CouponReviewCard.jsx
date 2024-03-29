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
import { couponsData, mComments, mTasks } from "../../hooks/reduxStore";
import { flexCenter, textCenter } from "../Utils/pageStyles";
import { grayBackground } from "../Utils/colors";
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

  const [taskId, setTaskId] = useState("");
  console.log(taskId);
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
    // dispatch({
    //   type: "FETCH_MERCHANT_COMMENTS",
    //   payload: merchantId,
    // });
    // const taskIds = couponFiles.map((coupon) => coupon.taskId);

    // Fetch comments for all coupon taskIds
    // taskIds.forEach((taskId) => {
    //   dispatch({
    //     type: "FETCH_COUPON_COMMENTS",
    //     payload: taskId,
    //   });
    // });

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

  const couponFiles = couponsData() || [];
  console.log(couponFiles);
  const merchantComments = mComments();
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
            id: taskId,
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

  const handleUpdateTask = (taskId, choice, taskStatus) => {
    console.log(taskId);
    console.log(choice);
    console.log(taskStatus);
    setTaskId(taskId);
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
      pathname: `/fargo/coupon/${merchantId}/${couponId}`,
    });
  };

  return (
    <>
      {couponFiles.length > 0 ? (
        couponFiles.map((file, i) => {
          // const couponTask = tasks.find((task) => task.coupon_id === file.id);
          const couponTask = Array.isArray(tasks)
            ? tasks.find((task) => task.coupon_id === file.id)
            : null;

          const relatedComments = merchantComments.filter(
            (comment) => comment.coupon_id === file.id
          );

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
                  {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                  {/* ~~~~~~~~~~ Status Menu ~~~~~~~~~~ */}
                  {/* Need to add onChange prop here to resolve error */}
                  {file.taskId ? (
                    <>
                      <Box sx={flexCenter}>
                        <Typography sx={{ mr: 2 }}>#{file.id}</Typography>
                      </Box>
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
                    </>
                  ) : null}
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
                    {/* <CommentDisplay comment={mostRecentComment} /> */}
                    {relatedComments.length > 0 ? (
                      relatedComments.map((comment, index) => (
                        <CommentDisplay key={index} comment={comment} />
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ ml: 3 }} >
                        No comment available
                      </Typography>
                    )}
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
