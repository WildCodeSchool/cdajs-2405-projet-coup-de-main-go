import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import AuthModal from "../components/AuthModal/AuthModal";
import GenericModal from "../components/Modal/GenericModal";
import { useAuth } from "../contexts/AuthContext";
import NewAdModal from "../components/NewAdModal/NewAdModal";
import { Button } from "@mui/material";

function HomePage() {
  const { isAuthenticated } = useAuth();
  const [authModalIsOpen, setAuthModalIsOpen] = useState<boolean>(false);
  const [newAdModalIsOpen, setNewAdModalIsOpen] = useState<boolean>(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <h1>JE SUIS LA PAGE D'ACCUEIL</h1>
      <button onClick={() => setAuthModalIsOpen(true)}>
        S’inscrire / Se connecter
      </button>
      <GenericModal
        open={authModalIsOpen}
        onClose={() => setAuthModalIsOpen(false)}
        maxWidth="800px"
      >
        <AuthModal />
      </GenericModal>
      <Button onClick={() => setNewAdModalIsOpen(true)}>
        Créer une annonce
      </Button>
      {newAdModalIsOpen && (
        <NewAdModal
          isModalOpen={newAdModalIsOpen}
          closeModal={() => setNewAdModalIsOpen(false)}
        />
      )}
      <Button component={Link} to={`/ads`}>
        Explorer
      </Button>
    </>
  );
}

export default HomePage;
