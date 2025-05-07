import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getUser();
      const isLoggedIn = authService.isAuthenticated();
      const isAdminUser = authService.isAdmin();
      
      // Set initial state based on localStorage
      if (isLoggedIn && storedUser) {
        setCurrentUser(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(isAdminUser);
      }
      
      // Then try to get fresh data from the server
      if (isLoggedIn) {
        try {
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
          setIsAuthenticated(true);
          setIsAdmin(user.role?.name === 'admin');
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // Don't clear auth data on network errors
          if (error.response && error.response.status === 401) {
            // Only clear if unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setCurrentUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
          }
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      setIsAdmin(response.user.role?.name === 'admin');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      setIsAdmin(response.user.role?.name === 'admin');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsLoading(false);
    }
  };

  const updateUser = (userData) => {
    setCurrentUser(userData);
  };

  const value = {
    currentUser,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
