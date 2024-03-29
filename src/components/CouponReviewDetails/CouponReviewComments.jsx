import React, { useState, useEffect } from "react";
// ~~~~~~~~~~ Style ~~~~~~~~~
import { Typography, TextField } from "@mui/material";
import { border, primaryColor } from "../Utils/colors";
// ~~~~~~~~~~ Component ~~~~~~~~~
import CommentDisplay from "../CommentDisplay/CommentDisplay";
import CommentInput from "./CommentInput";
import SuccessAlert from "../SuccessAlert/SuccessAlert";
import "./CouponReviewDetails.css";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { mComments } from "../../hooks/reduxStore";
import { useAlert } from "../SuccessAlert/useAlert";

export default function CouponReviewComments({
  merchantId,
  onSubmit,
  file,
  handleUploadFile,
}) {
  console.log(file);
  const [taskId, setTaskId] = useState("");
  console.log(taskId);
  console.log(merchantId);
  const merchantComments = mComments() || [];
  console.log(merchantComments);

  // ~~~~~~~~~~ Alert ~~~~~~~~~~
  const { isAlertOpen, handleAlertClose, handleTaskUpdate } = useAlert();

  // useEffect to handle the extraction when merchantComments changes
  useEffect(() => {
    const taskIds = [
      ...new Set(merchantComments.map((comment) => comment.task_id)),
    ];

    // Check if the array is not empty and the first element is not null
    if (taskIds.length > 0 && taskIds[0] !== null) {
      const extractedTaskId = taskIds[0];
      setTaskId(extractedTaskId); // Set the taskId state variable
    } else {
      console.log("No valid task ID found");
    }
  }, [merchantComments]);

  return (
    <div
      style={{
        width: "50%",
        position: "relative",
        border: `1px solid ${primaryColor.color}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SuccessAlert
        isOpen={isAlertOpen}
        onClose={handleAlertClose}
        caseType="NewComment"
      />
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", textAlign: "center", mb: 1 }}
      >
        Comments
      </Typography>

      {merchantComments.length > 0 ? (
        merchantComments.map((comment, i) => (
          <div className="comment-display-row" key={i}>
            <CommentDisplay comment={comment} showAllComments={true} />
          </div>
        ))
      ) : (
        <Typography variant="body2" sx={{ textAlign: "center" }}>
          No comments, add one below!
        </Typography>
      )}

      <div style={{ width: "100%", marginTop: "auto" }}>
        <CommentInput
          merchantId={merchantId}
          taskId={taskId}
          onSubmit={onSubmit}
          onChange={handleTaskUpdate}
          file={file}
          onUploadFile={handleUploadFile}
        />
      </div>
    </div>
  );
}
