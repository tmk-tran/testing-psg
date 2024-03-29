import { Box, Typography } from "@mui/material";

export default function OrgAdminInfo() {
  return (
    <Box sx={{ position: "absolute", ml: 3, width: "30vw" }}>
      <Typography>
        Participating sellers are listed in the table below
        <ul>
          <li>
            <Typography variant="body2">
              Add a seller to the table using the 'New Seller' button
            </Typography>
          </li>
        </ul>
      </Typography>
      <Typography>
        To purchase a book:
        <ol>
          <li>
            <Typography variant="body2">
              Click the button next to Referral ID for seller to view unique URL
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Visit seller URL to complete purchase
            </Typography>
          </li>
        </ol>
      </Typography>
      {/* <Typography>
        To request more books for your fundraiser:
        <ul>
          <li>
            <Typography variant="body2">
              Click the 'Request Paper Books' button below contact information
            </Typography>
          </li>
        </ul>
      </Typography> */}
    </Box>
  );
}
