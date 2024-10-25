import { createBrowserRouter } from "react-router-dom";
import Ads from "./components/Ads.tsx";

import App from "./App.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/ads",
    element: <Ads />,
  },
]);
