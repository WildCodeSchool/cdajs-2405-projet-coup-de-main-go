import { createBrowserRouter } from "react-router-dom";
import AdCatalog from "./pages/AdCatalog.tsx";
import App from "./App.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard.tsx";
import HomePage from "./pages/HomePage.tsx";
import Ad from "./pages/Ad.tsx";

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
      {
        path: "/ads",
        element: <AdCatalog />,
      },
      {
        path: "/ad/:adId",
        element: <Ad />,
      },
    ],
  },
]);
