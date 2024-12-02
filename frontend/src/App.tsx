import { Box, Container } from "@mui/material";
import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Box>
        <Container maxWidth="xl">
          <Header isAuthenticated={isAuthenticated} />
        </Container>

      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </Box>
  );
}