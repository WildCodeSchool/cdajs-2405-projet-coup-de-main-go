import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { UserProvider } from "./contexts/UserContext";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./mui";

import "./App.css";

export const apolloClient = new ApolloClient({
  uri: import.meta.env.VITE_BACKEND_URL,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </ThemeProvider>
    </ApolloProvider>
  </StrictMode>
);
