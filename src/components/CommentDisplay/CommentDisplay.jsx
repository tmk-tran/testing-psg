import { Box, Typography } from "@mui/material";
import { capitalizeFirstWord, formatDate } from "../Utils/helpers";
import { border } from "../Utils/colors";

const commentBoxStyle = {
  borderRadius: "5px",
  p: 1,
  mr: 1,
  width: "100%",
};

export default function CommentDisplay({ comment, showAllComments, maxWidth }) {
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
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={maxWidth}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: "bold",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user}
          </Typography>
        </div>
        <div>
          <Typography variant="caption" sx={{ ml: 2, mt: 0.4 }}>
            {/* {date} - {time} */}
            {date}
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
