import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { user_login_token } from '../../utils/constants';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const token = localStorage.getItem(user_login_token);

    if (!token) {
        // User not logged in, redirect to login
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
