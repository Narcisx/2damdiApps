import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect } from 'react';

export const ProtectedRoute = () => {
    const { user, loading, checkUser } = useAuthStore();

    useEffect(() => {
        checkUser();
    }, [checkUser]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
