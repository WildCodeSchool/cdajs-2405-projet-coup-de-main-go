import { Box, Typography, Stack } from "@mui/material";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Navigate, useOutletContext } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import Cards from "./frames/Cards";

import home from "/images/picture.png";

import "./home.css";

export default function Home() {
    const { isAuthenticated } = useAuth();
    const setAuthModalIsOpen: Dispatch<SetStateAction<boolean>> =
        useOutletContext();

    useEffect(() => {
        setAuthModalIsOpen(false);
    }, [isAuthenticated]);

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
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
            <Stack margin={2} spacing={3} sx={{ paddingBottom: "5rem" }}>
                <Typography
                    color="secondary"
                    variant="h5"
                    component="h1"
                    fontWeight={500}
                >
                    COMMENT ÇA MARCHE ?
                </Typography>
                <Cards />
            </Stack>
        </>
    );
}
