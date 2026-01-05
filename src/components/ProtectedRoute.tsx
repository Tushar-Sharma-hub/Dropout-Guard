import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user!.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user!.role === 'teacher' ? '/dashboard' : '/student-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
