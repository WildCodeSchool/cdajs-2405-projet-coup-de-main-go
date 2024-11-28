import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context"; // Importer setContext pour gérer les en-têtes
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import { AuthProvider } from "./contexts/AuthContext";
import { router } from "./routes";
import { UserProvider } from "./contexts/UserContext";
import theme from "./mui";

import "./App.css";

const httpLink = createHttpLink({
    uri: import.meta.env.VITE_BACKEND_URL,
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("cdmg-token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ApolloProvider client={apolloClient}>
            <ThemeProvider theme={theme}>
                <UserProvider>
                    <AuthProvider>
                        <RouterProvider router={router} />
                    </AuthProvider>
                </UserProvider>
            </ThemeProvider>
        </ApolloProvider>
    </StrictMode>
);
