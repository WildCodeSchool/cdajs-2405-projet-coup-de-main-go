import { Navigate } from "react-router-dom";

import AuthModal from "../components/AuthModal/AuthModal";
import { useAuth } from "../contexts/AuthContext";
import { Container } from "@mui/material";
import { useAuthModal } from "../contexts/AuthModalContext";

function HomePage() {
  const { isAuthenticated } = useAuth();
  const { authModalIsOpen, setAuthModalIsOpen } = useAuthModal();

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <Container sx={{ flex: 1, p: 3 }}>
      {authModalIsOpen && (
        <AuthModal closeModal={() => setAuthModalIsOpen(false)} />
      )}
    </Container>
  );
}

export default HomePage;
