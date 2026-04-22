/**
 * Authentication Context
 * 
 * WHAT this context provides:
 * - Global authentication state management
 * - User data and token storage
 * - Login/logout functionality
 * - Protected route checking
 * - Automatic token validation
 * 
 * WHY use Context API?
 * - Avoid prop drilling for auth state
 * - Centralized auth logic
 * - Easy access to user data across components
 * - Automatic re-renders when auth state changes
 * 
 * SECURITY FEATURES:
 * - Token validation on app load
 * - Automatic logout on token expiry
 * - Secure token storage in localStorage
 * - User data persistence across sessions
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create the authentication context
const AuthContext = createContext();

/**
 * Custom hook to use the auth context
 * Provides easy access to auth state and functions
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * Wraps the app and provides auth context to all children
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Check if token is valid by making API call
   * This verifies the token with the server
   */
  const validateToken = useCallback(async (tokenToValidate) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${tokenToValidate}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return { valid: true, user: data.data.user };
        }
      }
      
      return { valid: false, user: null };
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false, user: null };
    }
  }, []);

  /**
   * Initialize authentication state on app load
   * Checks for existing token and validates it
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          // Validate token with server
          const validation = await validateToken(storedToken);
          
          if (validation.valid) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, [validateToken]);

  /**
   * Login function
   * Stores token and user data, updates auth state
   */
  const login = useCallback((tokenData, userData) => {
    try {
      // Store in localStorage for persistence
      localStorage.setItem('token', tokenData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setToken(tokenData);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  /**
   * Logout function
   * Clears token and user data, updates auth state
   */
  const logout = useCallback(() => {
    try {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Update state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  /**
   * Update user data
   * Useful for profile updates
   */
  const updateUser = useCallback((userData) => {
    try {
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
    }
  }, [user]);

  /**
   * Get authorization header for API calls
   * Returns the properly formatted Authorization header
   */
  const getAuthHeader = useCallback(() => {
    if (token) {
      return { 'Authorization': `Bearer ${token}` };
    }
    return {};
  }, [token]);

  /**
   * Check if user has specific role
   * Useful for role-based access control
   */
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  // Context value object
  const value = {
    // State
    user,
    token,
    isLoading,
    isAuthenticated,
    
    // Functions
    login,
    logout,
    updateUser,
    getAuthHeader,
    hasRole,
    
    // Computed values
    isAdmin: user?.role === 'admin',
    userName: user?.name || '',
    userEmail: user?.email || '',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
