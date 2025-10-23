import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getItem, user_login_token } from '../../utils/localStore';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const token = getItem(user_login_token)?.token
    if (!token) {
        // User not logged in, redirect to login
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
