import React, { useState } from "react";
import LogoPSG from "../LogoPSG/LogoPSG";
import NavLinks from "../NavLinks/NavLinks";
import Swal from "sweetalert2";

import {
    Button,
    Card,
    CardContent,
    Typography,
    TextField,
} from "@mui/material";
// ~~~~~~~~~~ Hooks ~~~~~~~~~~
import { dispatchHook } from "../../hooks/useDispatch";
import { useHistory } from "react-router-dom";

function RecoverPasswordForm() {
    const dispatch = dispatchHook();
    const history = useHistory();
    const [email, setEmail] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault;
        Swal.fire(
            'Success!',
            'Password recovery email has been sent to the entered email address.',
            'success'
        )
        dispatch({
            type: "RECOVER_PASSWORD",
            payload: email
        })
        history.push(`/login/`)
    }


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
                            Please Enter Email Address
                        </Typography>
                        <br />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <TextField
                                type="text"
                                label="Email"
                                name="email"
                                required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                style={{ marginBottom: "10px" }}
                            >
                                Email Address
                            </TextField>
                        </div>
                        <br />
                        <div>
                            <Button variant="contained" onClick={handleSubmit} fullWidth>
                                Submit
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </>
    );
}

export default RecoverPasswordForm;
