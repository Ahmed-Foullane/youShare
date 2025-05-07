  import { useEffect, useState } from 'react';
  import { Navigate } from 'react-router-dom';
  import { useAuth } from '../hooks/useAuth';
  import authService from '../services/authService';

  const AdminRoute = ({ children }) => {
    const { isAdmin, isAuthenticated, isLoading } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
      const checkAdminStatus = async () => {
        if (isAdmin && isAuthenticated) {
          setIsAuthorized(true);
          setIsCheckingAuth(false);
          return;
        }

        const localStorageAdmin = authService.isAdmin();
        const isLocallyAuthenticated = authService.isAuthenticated();
        
        if (localStorageAdmin && isLocallyAuthenticated) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }

        setIsCheckingAuth(false);
      };

      checkAdminStatus();
    }, [isAdmin, isAuthenticated, isLoading]);

    if (isLoading || isCheckingAuth) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg font-medium text-white">Loading...</p>
        </div>
      );
    }

    if (!isAuthorized) {
      return <Navigate to="/" />;
    }

    return children;
  };

  export default AdminRoute;