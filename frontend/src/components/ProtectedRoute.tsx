import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { userId } = useUser();
  
  if (!userId) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}