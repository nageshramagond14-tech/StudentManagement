/**
 * Protected Route Component
 * 
 * WHAT this component does:
 * - Protects routes from unauthenticated access
 * - Redirects to login page if user is not authenticated
 * - Shows loading state while checking authentication
 * - Preserves the intended destination for post-login redirect
 * 
 * WHY this is IMPORTANT:
 * - Prevents unauthorized access to protected pages
 * - Provides better user experience with proper redirects
 * - Maintains application security on the frontend
 * - Works with the AuthContext for centralized auth management
 * 
 * USAGE:
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    // Store the intended destination for post-login redirect
    const state = { from: location };
    return <Navigate to="/login" state={state} replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
