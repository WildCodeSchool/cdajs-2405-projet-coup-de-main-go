import logo from "../../../public/images/logo_main_go.png"
import { Button, Stack } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import AuthModal from "../AuthModal/AuthModal";

export default function Header() {
    const { isAuthenticated } = useAuth();
    const [authModalIsOpen, setAuthModalIsOpen] = useState<boolean>(false);

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }
    
return (
    <Stack spacing={0} sx={{ px: 2}} component="header">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <img src={logo as string} alt="Logo Coup de main-go" />
            <Button onClick={() => setAuthModalIsOpen(true)}>S'inscrire / Se connecter</Button>
            {authModalIsOpen && (
                <AuthModal closeModal={() => setAuthModalIsOpen(false)} />
            )}
        </Stack>
    </Stack>
)

}