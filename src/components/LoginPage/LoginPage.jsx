import LoginForm from "../LoginForm/LoginForm";
import { Button, Typography } from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { historyHook } from "../../hooks/useHistory";

function LoginPage() {
  const history = historyHook();
  const envBanner = process.env.REACT_APP_ENV_BANNER;

  return (
    <div>
      {envBanner && (
        <Typography
          variant="h5"
          sx={{ textAlign: "center", fontWeight: "bold" }}
        >
          {envBanner}
        </Typography>
      )}
      <br />
      <LoginForm />

      <center
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          style={{ textDecoration: "underline", textTransform: "none" }}
          onClick={() => {
            history.push("/recover");
          }}
        >
          Forgot Password?
        </Button>
      </center>
    </div>
  );
}

export default LoginPage;
