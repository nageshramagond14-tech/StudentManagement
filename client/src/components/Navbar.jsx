/**
 * Navbar Component (Semantic <header>)
 * 
 * WHY use semantic <header> and <nav>?
 * - Accessibility: Screen readers identify these as navigation landmarks.
 * - SEO: Search engines understand the site structure better.
 * - Stickiness: Fixed at the top for easy navigation across pages.
 * 
 * AUTHENTICATION FEATURES:
 * - Shows different navigation based on auth state
 * - Displays user name when logged in
 * - Provides logout functionality
 * - Redirects appropriately based on authentication status
 */

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, LayoutDashboard, Home, PlusCircle, LogOut, LogIn, UserPlus } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  // Navigation links for authenticated users
  const authNavLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Add Student', path: '/add', icon: PlusCircle },
  ];

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show auth-related links on login/signup pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-600 p-1.5 rounded-lg transition-transform group-hover:rotate-12">
              <Users className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              StudentPortal
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Show Home link always */}
            <Link
              to="/"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary-600 ${
                location.pathname === '/' ? 'text-primary-600' : 'text-slate-600'
              }`}
            >
              <Home size={18} />
              Home
            </Link>

            {/* Show protected navigation only when authenticated */}
            {isAuthenticated && !isAuthPage && authNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary-600 ${
                    isActive ? 'text-primary-600' : 'text-slate-600'
                  }`}
                >
                  <Icon size={18} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Authentication Section */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              // Loading state
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            ) : isAuthenticated ? (
              // Authenticated user
              <div className="flex items-center gap-3">
                {/* User info */}
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <UserPlus size={16} className="text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {user?.name || 'User'}
                  </span>
                </div>

                {/* Logout button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-red-600"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              // Unauthenticated user
              !isAuthPage && (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                      <LogIn size={16} />
                      <span className="hidden sm:inline">Login</span>
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="flex items-center gap-1.5">
                      <UserPlus size={16} />
                      <span className="hidden sm:inline">Sign Up</span>
                    </Button>
                  </Link>
                </div>
              )
            )}

            {/* Mobile Menu Button (Simplified for this demo) */}
            <div className="flex md:hidden">
              <Button variant="ghost" size="sm">
                <span className="sr-only">Open menu</span>
                <Users size={24} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
