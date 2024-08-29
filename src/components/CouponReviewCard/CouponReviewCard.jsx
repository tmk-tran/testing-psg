import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// ~~~~~~~~~~ Style ~~~~~~~~~~ //
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { borderPrimaryColor, grayBorderColor } from "../Utils/colors";
import DeletePdfIcon from "../CouponReviewDetails/DeletePdfIcon";
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
import { capitalizeWords } from "../Utils/helpers";
import { showDeleteSweetAlert, showSaveSweetAlert } from "../Utils/sweetAlerts";

const thumbnailHeaderStyle = {
  ...grayBackground,
  ...textCenter,
};

export default function CouponReviewCard({ merchant, onTaskUpdate }) {
  const mId = useParams();
  const merchantId = mId.id;

  const [taskId, setTaskId] = useState("");
  const [couponId, setCouponId] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("");
  const [isTaskUpdate, setIsTaskUpdate] = useState(false);
  const [changesRequested, setChangesRequested] = useState(false);
  const [completedCoupon, setCompletedCoupon] = useState(false);

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
  const merchantComments = mComments();
  const tasks = mTasks() || [];

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
      dispatch(dispatchAction);
    }

    if (completedCoupon) {
      const dispatchAction2 = {
        type: "ADD_TO_CONSUMER_LIST",
        payload: {
          id: couponId,
        },
      };
      dispatch(dispatchAction2);
    }

    showSaveSweetAlert({ label: "Task Updated" });
  };

  const handleContainerClick = (event) => {
    // Prevent the click event from propagating to the Card and triggering history.push
    event.stopPropagation();
  };

  const handleUpdateTask = (taskId, couponId, choice, selectedTaskStatus) => {
    setTaskId(taskId);
    setCouponId(couponId);
    setNewTaskStatus(choice);
    setTaskStatus(taskStatus);
    setIsTaskUpdate(true);
  };

  const handleChangeRequest = (boolean) => {
    setChangesRequested(boolean);
    console.log("Changes requested: ", changesRequested);
  };

  const handleCompletedCoupon = (boolean) => {
    setCompletedCoupon(boolean);
  };

  const handleCardClick = (couponId) => {
    history.push({
      pathname: `/fargo/coupon/${merchantId}/${couponId}`,
    });
  };

  const handleRemoveCoupon = (couponId) => {
    const action = {
      type: "REMOVE_COUPON",
      payload: {
        couponId: couponId,
        merchantId: merchantId,
      },
    };
    showDeleteSweetAlert(() => {
      dispatch(action);
    }, "removeCoupon");
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
                  {file.taskId ? (
                    <>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                          mr: 1,
                          px: 1,
                          border: `1px solid ${grayBorderColor}`,
                        }}
                      >
                        {/* Button to remove coupon */}
                        <DeletePdfIcon
                          size={20}
                          deleteTitle="Remove this coupon"
                          onDelete={handleRemoveCoupon}
                          fileId={file.id}
                        />
                        {/* Displays the coupon number */}
                        <Typography>#{file.id}</Typography>
                      </Stack>
                      <CouponStatusDropdown
                        couponId={file.id}
                        task={couponTask}
                        handleUpdateTask={handleUpdateTask}
                        onChange={handleChangeRequest}
                        complete={handleCompletedCoupon}
                      />
                      <Button
                        variant="outlined"
                        sx={{ ml: 1 }}
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    {file.year ? (
                      <Typography variant="body2" sx={thumbnailHeaderStyle}>
                        Year: <strong>{file.year}</strong>
                      </Typography>
                    ) : null}
                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                    {/* ~~~~~~~~~ COMMENTS ~~~~~~~~~~ */}
                    {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                    <Box sx={{ mt: 5, p: 0.5 }}>
                      {/* <CommentDisplay comment={mostRecentComment} /> */}
                      {relatedComments.length > 0 ? (
                        relatedComments.map((comment, index) => (
                          <CommentDisplay key={index} comment={comment} showAllComments={false} />
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ ml: 3, textAlign: "center" }}
                        >
                          No comment available
                        </Typography>
                      )}
                    </Box>
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
