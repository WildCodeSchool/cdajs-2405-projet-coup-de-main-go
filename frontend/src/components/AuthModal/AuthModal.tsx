import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";

import Login from "./components/Login";
import Register from "./components/Register";

function AuthModal() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [alreadyHasAnAccount, setAlreadyHasAnAccount] =
        useState<boolean>(true);
    const [justRegistered, setJustRegistered] = useState<boolean>(false);
    let modalStyles = {};
    let image = "";
    let imgStyles = {};

    if (isMobile) {
        modalStyles = {
            height: "calc(100vh - 32px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        };
        image = "coup_de_main_go";
        imgStyles = {
            width: "128px",
            borderRadius: "20px",
        };
    } else {
        modalStyles = {
            height: "600px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
        };
        image = "auth-modal-img";
        imgStyles = {
            width: "40%",
            minHeight: "100%",
            objectFit: "cover",
            objectPosition: "40%",
            borderRadius: "20px",
        };
    }

    return (
        <Stack sx={modalStyles}>
            <Box
                component="img"
                id="auth-modal-img"
                src={`/images/${image}.png`}
                sx={imgStyles}
            />
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
