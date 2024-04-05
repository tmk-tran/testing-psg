import React from "react";
import { Box, Button, Typography } from "@mui/material";

import { useHistory } from "react-router-dom";
import RegisterForm from "../RegisterForm/RegisterForm";

function RegisterPage() {
  const history = useHistory();

  return (
    <div>
      <br />
      {/* Commented out for deployment testing */}
      {/* <RegisterForm /> */}

      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Welcome to the Fargo testing environment
        </Typography>
        <Typography>
          Please purchase a coupon book to access the app
        </Typography>
      </Box>

    </div>
  );
}

export default RegisterPage;
