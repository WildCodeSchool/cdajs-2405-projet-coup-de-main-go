import { useAuth } from "../contexts/AuthContext";
import { Box, Button } from "@mui/material";
import DashboardSection from "../components/Dashboard/DashboardSection";

export default function Dashboard() {
  // To delete once header is finalised
  const { logout } = useAuth();

  return (
    <>
      {/* To delete once header is finalised */}
      <button onClick={() => logout()}>Se déconnecter</button>

      {/*  Dashboard */}
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
