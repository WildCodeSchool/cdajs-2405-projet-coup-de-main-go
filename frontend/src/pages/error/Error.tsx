import { Box, Link, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";

import AuthModal from "../../components/AuthModal/AuthModal";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import GenericModal from "../../components/Modal/GenericModal";
import { useAuth } from "../../contexts/AuthContext";

import error from "@public/images/undraw_not_found_re_bh2e.svg";

export default function Error() {
    const { isAuthenticated } = useAuth();
    const [authModalIsOpen, setAuthModalIsOpen] = useState<boolean>(false);

    if (isAuthenticated) {
        setAuthModalIsOpen(false);
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <Box>
            <Header setAuthModalIsOpen={setAuthModalIsOpen} />
            <GenericModal
                open={authModalIsOpen}
                onClose={() => setAuthModalIsOpen(false)}
                maxWidth="800px"
            >
                <AuthModal />
            </GenericModal>
            <Stack alignItems="center" justifyContent="center" component="main">
                <img src={error} alt="Not_found" />
                <Typography>
                    Cette page n'existe plus, elle a peut-être été supprimée,
                    vous pouvez retourner à l'accueil juste{" "}
                    <Link href="/" underline="hover">
                        ici
                    </Link>
                </Typography>
            </Stack>
            <Footer />
        </Box>
    );
}
