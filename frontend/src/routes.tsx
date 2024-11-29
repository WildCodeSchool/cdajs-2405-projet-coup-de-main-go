import { createBrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard.tsx";
import HomePage from "./pages/HomePage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/dashboard",
                element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);
