import {
    Box,
    Typography,
    Stack,
    useTheme,
    useMediaQuery,
    Button,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Navigate, useOutletContext } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import Cards from "./frames/Cards";

import home from "/images/picture.png";
import homeMobile from "/images/landing_mobile.png";

import "./home.css";

export default function Home() {
    const { isAuthenticated } = useAuth();
    const setAuthModalIsOpen: Dispatch<SetStateAction<boolean>> =
        useOutletContext();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        setAuthModalIsOpen(false);
    }, [isAuthenticated]);

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            {isMobile ? (
                <>
                    <Box
                        component="img"
                        src={homeMobile}
                        alt="deux personnes agées qui rient ensemble"
                        sx={{
                            width: "100%",
                            maxHeight: "400px",
                            objectFit: "cover",
                        }}
                        className="home-img"
                    />
                    <Stack
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: "16px",
                        }}
                    >
                        <Typography
                            color="secondary"
                            variant="h5"
                            component="h1"
                            fontWeight={500}
                        >
                            Rejoignez-nous !
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: theme.palette.primary.main,
                                "&:hover": {
                                    bgcolor: theme.palette.primary.dark,
                                },
                                textAlign: "center",
                                borderRadius: "10px",
                            }}
                            onClick={() => setAuthModalIsOpen(true)}
                        >
                            S’inscrire / Se connecter
                        </Button>
                    </Stack>
                </>
            ) : (
                <Box
                    component="img"
                    src={home}
                    alt="deux personnes qui se tiennent la main"
                    sx={{
                        width: "100%",
                        maxHeight: "400px",
                        objectFit: "cover",
                    }}
                    className="home-img"
                />
            )}
            <Stack margin={2} spacing={3} sx={{ paddingY: "2.5rem" }}>
                {!isMobile && (
                    <Typography
                        color="secondary"
                        variant="h5"
                        component="h1"
                        fontWeight={500}
                        paddingBottom="2.5rem"
                    >
                        COMMENT ÇA MARCHE ? 🤔🤔
                    </Typography>
                )}
                <Cards />
            </Stack>
        </>
    );
}
