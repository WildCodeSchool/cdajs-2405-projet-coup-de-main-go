import { Drawer, List, ListItemButton, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import HeaderButton from "../Header/HeaderButton";
import { useState } from "react";
import AdModal from "../AdModal/AdModal";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  onLogout: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  onToggle,
  onLogout,
}: MobileMenuProps) {
  const [adModalOpen, setAdModalOpen] = useState<boolean>(false);

  const handleAdModalOpen = () => {
    setAdModalOpen(true);
  };

  const handleAdModalClose = () => {
    setAdModalOpen(false);
  };

  return (
    <>
      <IconButton onClick={onToggle}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="right" open={isOpen} onClose={onClose}>
        <List sx={{ width: 250 }}>
          <ListItemButton
            onClick={onClose}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            <HeaderButton
              color="secondary"
              text="Créer une annonce"
              icon="/images/mango.webp"
              onClick={handleAdModalOpen}
            />
            <HeaderButton
              color="primary"
              text="Explorer"
              paddingX={4}
              to={"/catalog"}
            />
            <HeaderButton
              color="error"
              text="Déconnexion"
              paddingX={4}
              onClick={onLogout}
            />
          </ListItemButton>
        </List>
      </Drawer>

      <AdModal open={adModalOpen} onClose={handleAdModalClose} />
    </>
  );
}
