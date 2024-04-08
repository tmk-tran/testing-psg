import { Box, Typography } from "@mui/material";
import { capitalizeFirstWord, formatDate } from "../Utils/helpers";
import { border } from "../Utils/colors";

const commentBoxStyle = {
  borderRadius: "5px",
  p: 1,
  mr: 1,
  width: "100%",
};

export default function CommentDisplay({ comment, showAllComments }) {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Check if the comment is null or undefined
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  if (!comment || comment.length === 0) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", ...commentBoxStyle }}
      >
        <Typography>No Comments Available</Typography>
      </Box>
    );
  }
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  console.log(comment);
  const content = comment.comment_content;
  console.log(content);
  const user = comment.user;
  console.log(user);
  console.log(showAllComments);
  console.log(comment);
  const date = comment.formatted_date;
  console.log(date);
  const time = comment.formatted_time;
  console.log(time);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Display only the most recent comment if showAllComments is false
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const mostRecentComment = !showAllComments
    ? comment
    : [comment[comment.length - 1]];
  console.log(mostRecentComment);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  return (
    <Box sx={commentBoxStyle}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {user}
          </Typography>
        </div>
        <div>
          <Typography variant="caption" sx={{ ml: 2, mt: 0.4 }}>
            {date} - {time}
          </Typography>
        </div>
      </div>

      <div style={{ marginLeft: "15px", position: "relative" }}>
        <span
          style={{
            position: "absolute",
            fontSize: "20px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          •
        </span>
        {/* {content ? (
          <Typography variant="body2" sx={{ ml: 3 }}>
            {capitalizeFirstWord(content)}
          </Typography>
        ) : (
          <Typography>No Comments Available</Typography>
        )} */}
        {content !== undefined && content !== "" ? (
          <Typography variant="body2" sx={{ ml: 3 }}>
            {capitalizeFirstWord(content)}
          </Typography>
        ) : (
          <Typography variant="caption">No Comments Available</Typography>
        )}
      </div>
    </Box>
  );
}
