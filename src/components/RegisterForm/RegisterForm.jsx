import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
} from "@mui/material";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: "REGISTER",
      payload: {
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName,
      },
    });
  }; // end registerUser

  return (
    <>
      <br />
      <form className="formPanel" onSubmit={registerUser}>
        <Card>
          <CardContent>
            <Typography
              variant="h5"
              component="h2"
              style={{ fontWeight: "bold" }}
            >
              Register New User
              {errors.registrationMessage && (
                <h3 className="alert" role="alert">
                  {errors.registrationMessage}
                </h3>
              )}
            </Typography>
            <br />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <TextField
                type="text"
                label="First Name"
                name="firstName"
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                style={{ marginBottom: "10px" }}
              >
                First Name
              </TextField>
              <TextField
                type="text"
                label="Last Name"
                name="lastName"
                required
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                style={{ marginBottom: "10px" }}
              >
                Last Name
              </TextField>
              <TextField
                type="text"
                label="Enter Username"
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
                label="Create Password"
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
              <Button variant="contained" onClick={registerUser} fullWidth>
                Register
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  );
}

export default RegisterForm;
