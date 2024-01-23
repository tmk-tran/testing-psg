import React, { useState } from "react";
// ~~~~~~~~~~ Style ~~~~~~~~~~
import {
  Button,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel,
  Typography,
} from "@mui/material";
import { border } from "../Utils/colors";

const statusOptions = [
  "*New Year: Merchant Coupon",
  "Add-on Request",
  "Changes Requested",
  "Completed Coupon",
  "Edit Proof",
  "New: Add-on Proof",
  "New: Create Proof",
  "Pending Merchant Approval",
  "Proof Approved",
  "Ready For Review",
  "Update Create Proof",
];

// const statusOptions = {
//   New: ["Initial Contact", "Follow Up Call/Email/Text", "Follow Up Visit"],
//   "In Progress": ["Add-on Request", "New Create Proof", "Update Create Proof"],
//   Complete: ["Drop Off Books", "Organization Picking Up Books"],
// };

export default function CouponReviewCard() {
  const [status, setStatus] = useState("");

  const handleMenuChange = (event) => {
    const choice = event.target.value;
    setStatus(choice);
  };

  return (
    <Card elevation={6} id="orgDetails-Card">
      <CardContent>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: "20px",
          }}
        >
          <Select
            value={status}
            onChange={handleMenuChange}
            style={{
              width: "100%",
              textAlign: "center",
              marginLeft: "unset",
              overflow: "hidden",
            }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Change Status
            </MenuItem>
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <Button sx={{ marginLeft: "10px" }}>Update</Button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          {/* REMOVE BORDERS AND PLACEHOLDERS UPON HOOKUP TO DB ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          <div style={border}>
            <div
              style={{
                height: "15vh",
                backgroundColor: "#D9D9D9",
              }}
            >
              <Typography sx={{ textAlign: "center", lineHeight: "15vh" }}>
                Front of Coupon
              </Typography>
            </div>
          </div>

          <div style={border}>
            <div
              style={{
                height: "15vh",
                backgroundColor: "#D9D9D9",
              }}
            >
              <Typography sx={{ textAlign: "center", lineHeight: "15vh" }}>
                Back of Coupon
              </Typography>
            </div>
          </div>

          <div style={border}>
            <div
              style={{
                height: "10vh",
                backgroundColor: "rgba(96, 96, 96, 0.1)",
              }}
            >
              <Typography
                variant="body2"
                sx={{ textAlign: "center", lineHeight: "10vh" }}
              >
                Details of Coupon
              </Typography>
            </div>
          </div>

          <div style={border}>
            <div
              style={{
                height: "10vh",
                backgroundColor: "rgba(96, 96, 96, 0.1)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div>
                  <Typography sx={{ ml: 1 }}>Username</Typography>
                </div>
                <div>
                  <Typography variant="body2" sx={{ ml: 3, mt: 0.4 }}>
                    time/date
                  </Typography>
                </div>
              </div>
              <li style={{ marginLeft: "15px" }}>Comment here</li>
            </div>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
