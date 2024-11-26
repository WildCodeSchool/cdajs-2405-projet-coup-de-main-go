import { useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";

import "./App.css";

function App() {
    const { isAuthenticated } = useAuth();

    return <main>{isAuthenticated ? <Dashboard /> : <Homepage />}</main>;
}

export default App;
