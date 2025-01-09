import { Box, Container } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import AuthModal from "./components/AuthModal/AuthModal";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import GenericModal from "./components/Modal/GenericModal";

export default function App() {
    const [authModalIsOpen, setAuthModalIsOpen] = useState<boolean>(false);

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
            <Container maxWidth="xl" disableGutters>
                <Outlet context={setAuthModalIsOpen} />
            </Container>
            <Footer />
        </Box>
    );
}
