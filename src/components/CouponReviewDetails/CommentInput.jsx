import React, { useState, useRef } from "react";
import { TextField, Button, Paper } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { dispatchHook } from "../../hooks/useDispatch";
import { User } from "../../hooks/reduxStore";
import { capitalizeFirstWord } from "../Utils/helpers";

export default function CommentInput({
  merchantId,
  taskId,
  onSubmit,
  onChange,
  file,
}) {
  const dispatch = dispatchHook();

  const [comment, setComment] = useState("");
  const [commentAdded, setCommentAdded] = useState(false);
  const user = User() || [];
  const currentUsername = user.username;

  const newComment = {
    merchant_id: merchantId,
    comment_content: comment,
    user: currentUsername,
    task_id: taskId,
    coupon_id: file?.id,
  };

  const handleSubmit = () => {
    // Handle comment submission logic
    dispatch({ type: "ADD_MERCHANT_COMMENT", payload: newComment });
    setCommentAdded(true);
    setComment("");
    onSubmit();
    onChange();
  };

  return (
    <Paper
      elevation={3}
      style={{
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        height: "fit-content",
      }}
    >
      <TextField
        label="Type your comment..."
        multiline
        maxRows={4}
        variant="outlined"
        value={comment}
        onChange={(e) => setComment(capitalizeFirstWord(e.target.value))}
        style={{ marginBottom: "10px" }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ flexGrow: 1 }}></div>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </Paper>
  );
}
