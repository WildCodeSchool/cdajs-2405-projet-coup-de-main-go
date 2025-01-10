import { Menu, MenuItem, ListItemIcon } from "@mui/material";
import { Logout } from "@mui/icons-material";

interface ProfileMenuProps {
  anchorEl: null | HTMLElement;
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileMenu({ anchorEl, onClose, onLogout }: ProfileMenuProps) {
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
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Déconnexion
      </MenuItem>
    </Menu>
  );
}
