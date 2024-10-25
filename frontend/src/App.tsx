import { Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
      <h1>coup-de-main-go</h1>
      <Link to="/chat">
        <button>Accéder au Chat</button>
      </Link>
    </>
  );
}

export default App;
