/**
 * Root Application Component
 * 
 * WHY at the root?
 * - Routing: Defines the structure of the app and which components render for each URL.
 * - Global Providers: AuthContext provides authentication state to all components.
 * - Protected Routes: Ensures only authenticated users can access certain pages.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import FormPage from './pages/FormPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SignupDebug from './pages/SignupDebug';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          {/* The Navbar is persistent across all pages */}
          <Navbar />
          
          {/* Main content changes based on the route */}
          <div className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup-debug" element={<SignupDebug />} />
              
              {/* Protected routes - require authentication */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add" 
                element={
                  <ProtectedRoute>
                    <FormPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit/:id" 
                element={
                  <ProtectedRoute>
                    <FormPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
