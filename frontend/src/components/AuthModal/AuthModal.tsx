import { useState } from "react";

import Login from "./components/Login";
import Register from "./components/Register";

import "./AuthModal.css";

interface AuthModalProps {
    closeModal: () => void;
}

function AuthModal({ closeModal }: AuthModalProps) {
    const [alreadyHasAnAccount, setAlreadyHasAnAccount] =
        useState<Boolean>(false);

    return (
        <div id="auth">
            <button
                id="closeModal"
                className="clickable"
                onClick={() => closeModal()}
            >
                <p>X</p>
            </button>
            <div id="modal-content">
                <img src="/images/auth-modal-img.png" />
                {alreadyHasAnAccount ? (
                    <Login goToRegister={() => setAlreadyHasAnAccount(false)} />
                ) : (
                    <Register goToLogin={() => setAlreadyHasAnAccount(true)} />
                )}
            </div>
        </div>
    );
}

export default AuthModal;
