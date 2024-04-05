import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Typography, TextField, Box } from "@mui/material";

function RegisterModal({ open, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  console.log(firstName, lastName);
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
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: 400,
          maxWidth: "90%",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Register New User
          {errors.registrationMessage && (
            <Typography variant="subtitle1" color="error">
              {errors.registrationMessage}
            </Typography>
          )}
        </Typography>
        <form onSubmit={registerUser}>
          <TextField
            type="text"
            label="First Name"
            name="firstName"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            type="text"
            label="Last Name"
            name="lastName"
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            type="text"
            label="Enter Email as Username"
            name="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            type="password"
            label="Create Password"
            name="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" type="submit" fullWidth>
            Register
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

export default RegisterModal;
