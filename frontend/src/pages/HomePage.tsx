import { useState } from "react";
import { Navigate } from "react-router-dom";

import AuthModal from "../components/AuthModal/AuthModal";
import { useAuth } from "../contexts/AuthContext";
import NewAdModal from "../components/NewAdModal/NewAdModal";

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
      {authModalIsOpen && (
        <AuthModal closeModal={() => setAuthModalIsOpen(false)} />
      )}
      <button onClick={() => setNewAdModalIsOpen(true)}>
        Créer une annonce
      </button>
      {newAdModalIsOpen && (
        <NewAdModal
          isModalOpen={newAdModalIsOpen}
          closeModal={() => setNewAdModalIsOpen(false)}
        />
      )}
    </>
  );
}

export default HomePage;
