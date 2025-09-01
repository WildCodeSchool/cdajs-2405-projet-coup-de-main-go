import Cookies from "js-cookie";
import { createContext, ReactNode, useContext, useState } from "react";

import { parseJwt } from "../utils/decode_jwt";

interface AuthContextType {
    isAuthenticated: boolean;
    userId: string | undefined;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    login: (token: string, userId: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const TOKEN_COOKIE_NAME = "cdmg-token";

const production = process.env.NODE_ENV !== "development";
const COOKIE_OPTIONS = {
  expires: 30,
  secure: production,
  sameSite: "strict" as const,
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const token = Cookies.get(TOKEN_COOKIE_NAME);

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        token ? true : false
    );

    const jwt_payload = token ? parseJwt(token) : undefined;
    const [userId, setUserId] = useState<string | undefined>(
        jwt_payload?.id.toString()
    );

    const login = (token: string, userId: string) => {
        Cookies.set(TOKEN_COOKIE_NAME, token, COOKIE_OPTIONS);
        setIsAuthenticated(true);
        setUserId(userId);
    };

    const logout = () => {
        Cookies.remove(TOKEN_COOKIE_NAME);
        setIsAuthenticated(false);
        setUserId(undefined);
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
