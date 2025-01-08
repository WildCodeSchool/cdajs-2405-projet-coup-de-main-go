import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import Cookies from "js-cookie";
import { ThemeProvider } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./routes";
import theme from "./mui";
import {
  AuthProvider,
  COOKIE_NAME_ID,
  TOKEN_COOKIE_NAME,
} from "./contexts/AuthContext";

import "./App.css";
import { AuthModalProvider } from "./contexts/AuthModalContext";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_BACKEND_URL,
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      const isTokenExpired =
        err.extensions?.stacktrace &&
        Array.isArray(err.extensions.stacktrace) &&
        err.extensions.stacktrace[0]?.startsWith(
          "TokenExpiredError: jwt expired"
        );

      const isUnthorized = err.message === "Unauthorized access";

      if (isTokenExpired || isUnthorized) {
        Cookies.remove(TOKEN_COOKIE_NAME);
        Cookies.remove(COOKIE_NAME_ID);
        window.location.reload();
      } else {
        console.error(`[GraphQL error]: ${err.message}`);
      }
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError.message || networkError}`);
  }
});

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get(TOKEN_COOKIE_NAME) || null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <AuthModalProvider>
            <RouterProvider router={router} />
          </AuthModalProvider>
        </AuthProvider>
      </ThemeProvider>
    </ApolloProvider>
  </StrictMode>
);
