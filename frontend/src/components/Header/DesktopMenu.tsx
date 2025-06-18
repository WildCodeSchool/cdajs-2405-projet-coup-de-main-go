import { Button, Avatar, CircularProgress, Typography } from "@mui/material";
import ProfileMenu from "./ProfileMenu";
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface DesktopMenuProps {
    onLogout: () => void;
    displayName: string;
    loading: boolean;
    error?: Error;
    profilePicture?: string | null;
    userId?: string;
}

export default function DesktopMenu({
    onLogout,
    displayName,
    loading,
    error,
    profilePicture,
    userId,
}: DesktopMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {error ? (
                <Typography color="error">Erreur: {error.message}</Typography>
            ) : (
                <Button
                    color="primary"
                    startIcon={
                        loading ? (
                            <CircularProgress size={24} color="secondary" />
                        ) : (
                            <Avatar
                                src={`${
                                    import.meta.env.VITE_DOMAIN_BACKEND_URL
                                }/uploads/users/${userId}/${profilePicture}`}
                                sx={{ width: 24, height: 24 }}
                            />
                        )
                    }
                    endIcon={
                        !loading &&
                        (isMenuOpen ? <ExpandLess /> : <ExpandMore />)
                    }
                    onClick={handleProfileClick}
                    sx={{ textTransform: "none", minWidth: 120 }}
                >
                    {!loading && displayName}
                </Button>
            )}
            <ProfileMenu
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                onLogout={onLogout}
            />
        </>
    );
}
