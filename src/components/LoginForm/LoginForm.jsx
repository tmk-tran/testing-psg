import React, { useState } from "react";
import LogoPSG from "../LogoPSG/LogoPSG";
import NavLinks from "../NavLinks/NavLinks";

import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
} from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { Errors } from "../../hooks/reduxStore";
import { dispatchHook } from "../../hooks/useDispatch";

function LoginForm() {
  const errors = Errors();
  const dispatch = dispatchHook();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // DEV only
  const ezLoginEnabled =
    process.env.REACT_APP_LOGIN && process.env.REACT_APP_PWD;

  const login = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: "LOGIN",
        payload: {
          username: username,
          password: password,
        },
      });
    } else {
      dispatch({ type: "LOGIN_INPUT_ERROR" });
    }
  }; // end login

  const handleNinjaLogin = () => {
    setUsername(process.env.REACT_APP_LOGIN);
    setPassword(process.env.REACT_APP_PWD);
  };

  return (
    <>
      <br />
      <form className="formPanel">
        {" "}
        {/* <-- this is default template styling, can remove later */}
        <Card>
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              style={{ fontWeight: "bold" }}
            >
              Account Sign{" "}
              <span onClick={ezLoginEnabled ? handleNinjaLogin : undefined}>
                In
              </span>
            </Typography>
            <br />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <TextField
                type="text"
                label="Username"
                name="username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                style={{ marginBottom: "10px" }}
              >
                Username
              </TextField>
              <TextField
                type="password"
                label="Password"
                name="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              >
                Password
              </TextField>
            </div>
            <br />
            <div>
              <Button variant="contained" onClick={login} fullWidth>
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  );
}

export default LoginForm;
