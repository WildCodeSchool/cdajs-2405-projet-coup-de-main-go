import { useState } from "react";

import AuthModal from "../components/AuthModal/AuthModal";

function Homepage() {
    const [authModalIsOpen, setAuthModalIsOpen] = useState<Boolean>(false);

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
