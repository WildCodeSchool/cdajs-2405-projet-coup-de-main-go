import { Box, Container } from "@mui/material";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import { useUser } from "./contexts/UserContext";

export default function App() {
  const { userId } = useUser();

  return (
    <Box>
      {userId && (
        <Container maxWidth="xl">
          <Header />
        </Container>
      )}

      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </Box>
  );
}
