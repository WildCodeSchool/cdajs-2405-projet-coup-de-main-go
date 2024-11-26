import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx"; // Le layout principal
import ChatPage from "./pages/ChatPage.tsx";
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from "./pages/HomePage.tsx"; // Page d'accueil

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
        path: "/chat",
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
