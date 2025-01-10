import { Box, Button, Stack, useMediaQuery } from "@mui/material";
import DashboardSection from "../components/Dashboard/DashboardSection";
import theme from "../mui";

export default function Dashboard() {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <img
        src="/images/dashboard-poster.png"
        alt="helping to walk"
        style={{
          width: "100%",
          minHeight: 153,
        }}
      />

      <Box marginX={isMobile ? 2 : 6} marginY={3}>
        <Stack
          sx={{
            marginY: 3,
            alignItems: isMobile ? "center" : "flex-start",
          }}
        >
          <Button sx={{ paddingX: 4 }}>Afficher toutes les annonces</Button>
        </Stack>

        <DashboardSection title="Les plus récentes" skillId="" />

        <DashboardSection title="Bricolage" skillId="1" />

        <DashboardSection title="Jardinage" skillId="2" />
      </Box>
    </>
  );
}
