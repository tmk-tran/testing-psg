import React from "react";
import LoginForm from "../LoginForm/LoginForm";
import { Button, Typography } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { historyHook } from "../../hooks/useHistory";

function LoginPage() {
  const history = historyHook();

  return (
    <div>
      <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold" }}>
        * Fargo Testing Environment *
      </Typography>
      <br />
      <LoginForm />

      <center
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Not a member?&nbsp;</Typography>
        <Button
          style={{ textDecoration: "underline" }}
          onClick={() => {
            history.push("/registration");
          }}
        >
          Create Account
        </Button>
      </center>
    </div>
  );
}

export default LoginPage;
