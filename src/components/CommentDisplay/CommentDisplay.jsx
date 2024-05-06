import { Box, Typography } from "@mui/material";
import { capitalizeFirstWord, formatDate } from "../Utils/helpers";
import { border } from "../Utils/colors";

const commentBoxStyle = {
  borderRadius: "5px",
  width: "100%",
};

export default function CommentDisplay({
  comment,
  showAllComments,
  divWidth,
  bulletSize,
}) {
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
  const content = comment.comment_content;
  const user = comment.user;
  const date = comment.formatted_date;
  const time = comment.formatted_time;

  return (
    <Box sx={commentBoxStyle}>
      <div style={divWidth}>
        {/* ~~~~~ User ~~~~~ */}
        <Typography
          variant="body2"
          sx={{
            ml: 2,
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {user}
        </Typography>
        {/* ~~~~~ Date & Time ~~~~~ */}
        <Typography variant="caption" sx={{ ml: 4, mt: 0.4 }}>
          {date} - {time}
        </Typography>
      </div>
      {/* ~~~~~ Comments ~~~~~ */}
      <div style={{ marginLeft: "15px", position: "relative" }}>
        <span
          style={{
            position: "absolute",
            ...bulletSize,
            top: "50%",
            transform: "translateY(-50%)",
            marginLeft: 25,
          }}
        >
          •
        </span>
        {content !== undefined && content !== "" ? (
          <Typography variant="body2" sx={{ ml: 5 }}>
            {capitalizeFirstWord(content)}
          </Typography>
        ) : (
          <Typography variant="caption">No Comments Available</Typography>
        )}
      </div>
    </Box>
  );
}
