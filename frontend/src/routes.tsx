import { createBrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard.tsx";
import HomePage from "./pages/HomePage.tsx";
import ChatPage from "./pages/ChatPage.tsx";
import UpdateProfilePicturePage from "./pages/UpdateProfilePicturePage.tsx";
import CreateAdPage from "./pages/CreateAdPage.tsx";

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
        path: "/chat",
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile-upload",
        element: (
          <ProtectedRoute>
            <UpdateProfilePicturePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/ad-upload",
        element: (
          <ProtectedRoute>
            <CreateAdPage />
          </ProtectedRoute>
        ),
      }
    ],
  },
]);
