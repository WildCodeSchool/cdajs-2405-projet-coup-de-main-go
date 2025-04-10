import Cookies from "js-cookie";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const TOKEN_COOKIE_NAME = "cdmg-token";
const COOKIE_OPTIONS = {
  expires: 30, // 30 days
  secure: true,
  sameSite: "strict" as const,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Cookies.get(TOKEN_COOKIE_NAME) ? true : false
  );

  const [userId, setUserId] = useState<string | null>(null);

  const login = (token: string, userId: string) => {
    Cookies.set(TOKEN_COOKIE_NAME, token, COOKIE_OPTIONS);
    setIsAuthenticated(true);
    setUserId(userId);
  };

  const logout = () => {
    Cookies.remove(TOKEN_COOKIE_NAME);
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthContext");
  }
  return context;
}
