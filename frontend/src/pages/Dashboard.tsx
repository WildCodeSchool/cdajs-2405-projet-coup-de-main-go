import { useAuth } from "../contexts/AuthContext";
import { Box, Button, useMediaQuery } from "@mui/material";
import DashboardSection from "../components/Dashboard/DashboardSection";
import theme from "../mui";

export default function Dashboard() {
  // To delete once header is finalised
  const { logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
          minHeight: 153,
        }}
      />

      <Box marginX={isMobile ? 2 : 6} marginY={3}>
        <Button sx={{ marginY: "1.5rem", paddingX: 4 }}>
          Afficher toutes les annonces
        </Button>

        <DashboardSection title="Les plus récentes" skillId="" />

        <DashboardSection title="Bricolage" skillId="1" />

        <DashboardSection title="Jardinage" skillId="2" />
      </Box>
    </>
  );
}
