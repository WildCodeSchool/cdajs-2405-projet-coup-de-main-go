import { Box, Stack } from "@mui/material";
import { useState } from "react";

import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import GetStyles from "./styles/GetStyles";

function AuthModal() {
    const [alreadyHasAnAccount, setAlreadyHasAnAccount] =
        useState<boolean>(true);
    const [forgotPassword, setForgotPassword] = useState<boolean>(false);
    const [justRegistered, setJustRegistered] = useState<boolean>(false);
    const [passwordChanged, setPasswordChanged] = useState<boolean>(false);
    const { modalStyles, image, imgStyles } = GetStyles();

    return (
        <Stack sx={modalStyles}>
            <Box
                component="img"
                id="auth-modal-img"
                src={`/images/${image}.png`}
                sx={imgStyles}
            />
            {!forgotPassword ? (
                alreadyHasAnAccount ? (
                    <Login
                        justRegistered={justRegistered}
                        passwordChanged={passwordChanged}
                        setJustRegistered={setJustRegistered}
                        setPasswordChanged={setPasswordChanged}
                        goToRegister={() => setAlreadyHasAnAccount(false)}
                        resetPassword={() => setForgotPassword(true)}
                    />
                ) : (
                    <Register
                        setJustRegistered={setJustRegistered}
                        goToLogin={() => setAlreadyHasAnAccount(true)}
                    />
                )
            ) : (
                <ForgotPassword
                    goToLogin={() => setForgotPassword(false)}
                    setPasswordChanged={setPasswordChanged}
                />
            )}
        </Stack>
    );
}

export default AuthModal;
