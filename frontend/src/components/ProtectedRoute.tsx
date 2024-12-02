import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

type ProtectedRouteProps = {
    children: JSX.Element;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}
