import React, { useState, useRef } from "react";
import { TextField, Button, Paper } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { dispatchHook } from "../../hooks/useDispatch";
import { User } from "../../hooks/reduxStore";
import { capitalizeFirstWord } from "../Utils/helpers";
import { useSelector } from "react-redux";

export default function CommentInput({
  merchantId,
  taskId,
  onSubmit,
  onChange,
  files,
}) {
  // console.log(merchantId);
  // console.log(taskId);
  // console.log(files);
  const [comment, setComment] = useState("");
  const [commentAdded, setCommentAdded] = useState(false);
  console.log(comment);
  console.log(commentAdded);
  const user = User() || [];
  console.log(user.username);
  const currentUsername = user.username;
  console.log(currentUsername);

  const dispatch = dispatchHook();
  const auth = useSelector((store) => store.auth)

  const newComment = {
    merchant_id: merchantId,
    comment_content: comment,
    user: currentUsername,
    task_id: taskId,
  };

  const handleSubmit = () => {
    // Handle comment submission logic
    console.log("Comment submitted:", newComment);
    dispatch({ type: "ADD_MERCHANT_COMMENT", payload: {newComment: newComment, auth: auth} });
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
