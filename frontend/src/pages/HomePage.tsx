import { useState } from "react";
import { Navigate } from "react-router-dom";

import AuthModal from "../components/AuthModal/AuthModal";
import { useAuth } from "../contexts/AuthContext";

function Homepage() {
    const { isAuthenticated } = useAuth();
    const [authModalIsOpen, setAuthModalIsOpen] = useState<Boolean>(false);

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

export default Homepage;
