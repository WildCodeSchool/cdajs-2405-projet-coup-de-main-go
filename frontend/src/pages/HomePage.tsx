import { useState } from "react";
import { Navigate } from "react-router-dom";

import AuthModal from "../components/AuthModal/AuthModal";
import { useAuth } from "../contexts/AuthContext";
import { Button, Container, Typography } from "@mui/material";

function HomePage() {
  const { isAuthenticated } = useAuth();
  const [authModalIsOpen, setAuthModalIsOpen] = useState<boolean>(false);

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <Container sx={{ flex: 1, p: 3 }}>
      <Typography variant="h1">Coup-de-main-go</Typography>
      <Button
        variant="contained"
        sx={{
          bgcolor: "var(--secondary)",
          "&:hover": { bgcolor: "var(--secondary-hover)" },
        }}
        onClick={() => setAuthModalIsOpen(true)}
      >
        S’inscrire / Se connecter
      </Button>
      {authModalIsOpen && (
        <AuthModal closeModal={() => setAuthModalIsOpen(false)} />
      )}
    </Container>
  );
}

export default HomePage;
