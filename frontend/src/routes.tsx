import { createBrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import ChatPage from "./pages/ChatPage.tsx";
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
]);
