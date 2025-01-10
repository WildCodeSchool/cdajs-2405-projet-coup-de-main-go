import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard.tsx";
import Error from "./pages/error/Error.tsx";
import Home from "./pages/home/Home.tsx";
import ChatPage from "./pages/ChatPage.tsx";
import Profil from "./pages/profil/Profil.tsx";
import EditProfil from "./pages/profil/EditProfil.tsx";
import Ad from "./pages/Ad.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
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
        path: "/chat",
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ad/:adId",
        element: (
          <ProtectedRoute>
            <Ad />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profil />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/modifier",
        element: (
          <ProtectedRoute>
            <EditProfil />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
