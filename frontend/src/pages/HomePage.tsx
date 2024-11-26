import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Button, Container } from "@mui/material";

export default function HomePage() {
  const { userId, setUserId } = useUser();

  const handleLogin = () => {
    setUserId("1");
  };
  return (
    <Container sx={{ flex: 1, p: 3 }}>
      <h1>coup-de-main-go</h1>
      {userId ? (
        <Link to="/chat" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary">
            Accéder au Chat
          </Button>
        </Link>
      ) : (
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Se connecter
        </Button>
      )}
    </Container>
  );
}
