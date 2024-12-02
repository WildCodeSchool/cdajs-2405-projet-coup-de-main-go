import { createBrowserRouter } from "react-router-dom";
import Ads from "./components/Ads.tsx";
import App from "./App.tsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard.tsx";
import HomePage from "./pages/HomePage.tsx";
import NewAd from "./components/NewAd.tsx";
import AdDetail from "./components/AdDetail.tsx";

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
        element: <Ads />,
      },
      {
        // TODO : Supprimer cette route lorsque la navbar sera en place et permettra l'ouverture/fermeture de la modale
        path: "/new-ad",
        element: <NewAd />,
      },
      {
        path: "/ad/:adId",
        element: <AdDetail />,
      },
    ],
  },
]);
