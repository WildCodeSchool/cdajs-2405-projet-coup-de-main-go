import { Box, Stack, useMediaQuery } from "@mui/material";
import { useState } from "react";

import Login from "./components/Login";
import Register from "./components/Register";

import "./AuthModal.css";

function AuthModal() {
    const isDesktop = useMediaQuery("(min-width:800px)");
    const [alreadyHasAnAccount, setAlreadyHasAnAccount] =
        useState<Boolean>(false);
    const [justRegistered, setJustRegistered] = useState<Boolean>(false);

    return (
        <Stack direction={"row"} height={"600px"}>
            {isDesktop && (
                <Box
                    component="img"
                    id="auth-modal-img"
                    src="/images/auth-modal-img.png"
                    sx={{
                        width: "40%",
                        minHeight: "100%",
                        objectFit: "cover",
                        objectPosition: "40%",
                        borderRadius: "20px",
                    }}
                />
            )}
            {alreadyHasAnAccount ? (
                <Login
                    justRegistered={justRegistered}
                    setJustRegistered={setJustRegistered}
                    goToRegister={() => setAlreadyHasAnAccount(false)}
                />
            ) : (
                <Register
                    setJustRegistered={setJustRegistered}
                    goToLogin={() => setAlreadyHasAnAccount(true)}
                />
            )}
        </Stack>
    );
}

export default AuthModal;
