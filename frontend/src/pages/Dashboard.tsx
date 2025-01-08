import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Box, Button } from "@mui/material";
import GenericModal from "../components/Modal/GenericModal";
import AdModalForm from "../components/NewAdModal/AdModalForm";
import DashboardSection from "../components/Dashboard/DashboardSection";

export default function Dashboard() {
  // To delete once header is available */
  const { logout } = useAuth();
  const [newAdModalIsOpen, setNewAdModalIsOpen] = useState<boolean>(false);
  const closeNewAdModal = () => {
    setNewAdModalIsOpen(false);
  };

  return (
    <>
      {/* To delete once header is available */}
      <button onClick={() => logout()}>Se déconnecter</button>
      <Button onClick={() => setNewAdModalIsOpen(true)}>
        Créer une annonce
      </Button>
      {newAdModalIsOpen && (
        <GenericModal
          open={newAdModalIsOpen}
          onClose={closeNewAdModal}
          maxWidth="md"
        >
          <AdModalForm onClose={closeNewAdModal} />
        </GenericModal>
      )}

      {/* Real Dashboard */}
      <img
        src="/images/dashboard-poster.png"
        alt="helping to walk"
        style={{
          width: "100%",
          minHeight: "153px",
        }}
      />

      <Box>
        <Button sx={{ margin: "1.5rem 0" }}>
          Afficher toutes les annonces
        </Button>

        <DashboardSection title="Les plus récentes" skillId="" />

        <DashboardSection title="Bricolage" skillId="1" />

        <DashboardSection title="Jardinage" skillId="2" />
      </Box>
    </>
  );
}
