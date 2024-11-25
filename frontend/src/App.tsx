import { Link } from "react-router-dom";
import "./App.css";
import { useUser } from "./contexts/UserContext";
import { Button } from "@mui/material";

function App() {
  const { userId, setUserId } = useUser();

  const handleLogin = () => {
    setUserId("1");
  };
  return (
    <>
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
    </>
  );
}

export default App;
