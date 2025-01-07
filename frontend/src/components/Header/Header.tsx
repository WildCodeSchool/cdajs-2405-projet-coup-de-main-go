import { Button, Stack } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import { useAuth } from "../../contexts/AuthContext";

import logo from "@public/images/logo_main_go.png";

interface HeaderProps {
    setAuthModalIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Header({ setAuthModalIsOpen }: HeaderProps) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <Stack spacing={0} sx={{ px: 2 }} component="header">
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <img src={logo as string} alt="Logo Coup de main-go" />
                    <Button onClick={() => setAuthModalIsOpen(true)}>
                        S'inscrire / Se connecter
                    </Button>
                </Stack>
            </Stack>
        );
    }
}
