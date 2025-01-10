import { Drawer, List, ListItemButton, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import HeaderButton from "../Header/HeaderButton";
import { useState } from "react";
import GenericModal from "../Modal/GenericModal";
import AdModalForm from "../NewAdModal/AdModalForm";

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
  const [newAdModalIsOpen, setNewAdModalIsOpen] = useState<boolean>(false);
  const closeNewAdModal = () => {
    setNewAdModalIsOpen(false);
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
              icon="/images/mango.png"
              onClick={() => setNewAdModalIsOpen(true)}
            />
            <HeaderButton color="primary" text="Explorer" paddingX={4} />
            <HeaderButton
              color="error"
              text="Déconnexion"
              paddingX={4}
              onClick={onLogout}
            />
          </ListItemButton>
        </List>
      </Drawer>

      {newAdModalIsOpen && (
        <GenericModal
          open={newAdModalIsOpen}
          onClose={closeNewAdModal}
          maxWidth="md"
        >
          <AdModalForm onClose={closeNewAdModal} />
        </GenericModal>
      )}
    </>
  );
}
