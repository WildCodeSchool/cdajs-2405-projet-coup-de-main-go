import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";

interface ProfileMenuProps {
  anchorEl: null | HTMLElement;
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileMenu({
  anchorEl,
  onClose,
  onLogout,
}: ProfileMenuProps) {
  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <Menu
      id="account-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: "visible",
            mt: 1,
            backgroundColor: "primary.main",
            color: "white",
            border: "none",
            borderRadius: "20px",
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem
        component={Link}
        to="/profil"
        onClick={onClose}
        sx={{
          fontSize: "0.875rem",
        }}
      >
        Profil
      </MenuItem>

      <MenuItem
        component={Link}
        to="/settings"
        onClick={onClose}
        sx={{
          fontSize: "0.875rem",
        }}
      >
        Paramètres
      </MenuItem>
      <MenuItem
        onClick={handleLogout}
        sx={{
          fontSize: "0.875rem",
        }}
      >
        Se déconnecter
      </MenuItem>
    </Menu>
  );
}
