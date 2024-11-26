import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";

interface AuthContextType {
    authToken: string;
    isAuthenticated: Boolean;
    setIsAuthenticated: (isAuthenticated: Boolean) => void;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authToken, setAuthToken] = useState<string>(
        localStorage.getItem("cdmg-token") || ""
    );
    const [isAuthenticated, setIsAuthenticated] = useState<Boolean>(
        localStorage.getItem("cdmg-token") ? true : false
    );

    const login = (token: string) => {
        localStorage.setItem("cdmg-token", token);
        window.location.reload();
    };

    const logout = () => {
        localStorage.removeItem("cdmg-token");
        window.location.reload();
    };

    useEffect(() => {
        const token: string | null = localStorage.getItem("cdmg-token");
        setAuthToken(token || "");
        // TO DO : Effectuer une requête nécessitant d'être authentifié.
        // Si elle échoue, logout, sinon, authentifié l'utilisateur comme ci-dessous.
        setIsAuthenticated(token ? true : false);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                authToken,
                isAuthenticated,
                setIsAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useToken must be used within a AuthProvider");
    }
    return context;
};
