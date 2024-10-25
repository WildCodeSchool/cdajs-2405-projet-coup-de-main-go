import { createBrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import ChatPage from "./pages/ChatPage.tsx";
import ChatLayout from "./components/ChatLayout.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/chat",
    element: <ChatLayout />,
    children: [
      {
        path: ":chatId",
        element: <ChatPage />,
      },
    ],
  },
]);
