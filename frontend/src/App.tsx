import { Container, Stack } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import AuthModal from "./components/AuthModal/AuthModal";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import GenericModal from "./components/Modal/GenericModal";

export default function App() {
  const [authModalIsOpen, setAuthModalIsOpen] = useState<boolean>(false);

  return (
    <Stack sx={{ minHeight: "100vh" }}>
      <Header setAuthModalIsOpen={setAuthModalIsOpen} />
      <GenericModal
        open={authModalIsOpen}
        onClose={() => setAuthModalIsOpen(false)}
        maxWidth="800px"
      >
        <AuthModal />
      </GenericModal>
      <Container maxWidth={false} disableGutters sx={{ flexGrow: 1 }}>
        <Outlet context={setAuthModalIsOpen} />
      </Container>
      <Footer />
    </Stack>
  );
}
