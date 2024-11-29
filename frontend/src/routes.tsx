import { createBrowserRouter } from "react-router-dom";
import Ads from "./components/Ads.tsx";
import App from "./App.tsx";
import NewAd from "./components/NewAd.tsx";
import AdDetail from "./components/AdDetail.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
]);
