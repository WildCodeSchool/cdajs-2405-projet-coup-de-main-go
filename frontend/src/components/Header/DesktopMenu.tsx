import { Button, Avatar, Typography, Box, CircularProgress, useTheme } from "@mui/material";
import ProfileMenu from "./ProfileMenu";
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useGetUserByIdQuery } from "../../generated/graphql-types";
import { useAuth } from "../../contexts/AuthContext";

interface DesktopMenuProps {
  onLogout: () => void;
}

export default function DesktopMenu({ onLogout }: DesktopMenuProps) {
  const { userId } = useAuth();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const { loading, error, data } = useGetUserByIdQuery({
    variables: { id: userId! },
    skip: !userId,
  });

  if (!userId) return null;

  if (loading)
    return (
      <Box sx={{ p: 4 }}>
        <CircularProgress size={36} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  
  if (error)
    return (
      <Box sx={{ p: 4, display: "flex", alignItems: "center" }}>
        <Typography color="error">Erreur lors du chargement des informations utilisateur</Typography>
      </Box>
    );

    const user = data?.getUserById;

  if (!user) {
    return (
      <Box sx={{ p: 4, display: "flex", alignItems: "center" }}>
        <Typography color="error">Utilisateur non trouvé</Typography>
      </Box>
    );
  }

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        color="primary"
        startIcon={<Avatar sx={{ width: 24, height: 24 }} />}
        endIcon={isMenuOpen ? <ExpandLess /> : <ExpandMore />}
        onClick={handleProfileClick}
        sx={{ textTransform: "none" }}
      >
        {`${user.firstName} ${user.lastName}`}
      </Button>
      <ProfileMenu
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        onLogout={onLogout}
      />
    </>
  );
}
