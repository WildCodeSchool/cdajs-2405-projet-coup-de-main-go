import { useState } from "react";
import { Navigate } from "react-router-dom";

import AuthModal from "../components/AuthModal/AuthModal";
import { useAuth } from "../contexts/AuthContext";

function HomePage() {
    const { isAuthenticated } = useAuth();
    const [authModalIsOpen, setAuthModalIsOpen] = useState<boolean>(false);

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
        </>
    );
}

export default HomePage;
