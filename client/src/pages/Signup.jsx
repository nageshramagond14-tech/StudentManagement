/**
 * Signup Page Component
 * 
 * WHAT this component does:
 * - Provides a registration form for new users
 * - Handles form submission and validation
 * - Manages signup state and error handling
 * - Stores JWT token on successful registration
 * - Redirects to dashboard after successful signup
 * 
 * SECURITY CONSIDERATIONS:
 * - Password minimum length validation (6 characters)
 * - Email format validation
 * - Client-side validation for better UX
 * - Server-side validation is still required (and implemented)
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader, Check } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = [];

    // Name validation
    if (!formData.name.trim()) {
      errors.push('Name is required');
    } else if (formData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else if (!emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Password validation
    if (!formData.password) {
      errors.push('Password is required');
    } else if (formData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.push('Please confirm your password');
    } else if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match');
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      setIsLoading(false);
      return;
    }

    try {
      // Make API call to signup endpoint
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle server errors
        if (data.errors && Array.isArray(data.errors)) {
          setError(data.errors.join(', '));
        } else {
          setError(data.message || 'Signup failed');
        }
        setIsLoading(false);
        return;
      }

      // Signup successful
      if (data.success) {
        setSuccess('Account created successfully! Redirecting...');
        
        // Store JWT token and user data
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    const levels = [
      { strength: 0, text: '', color: '' },
      { strength: 1, text: 'Weak', color: 'text-red-500' },
      { strength: 2, text: 'Fair', color: 'text-orange-500' },
      { strength: 3, text: 'Good', color: 'text-yellow-500' },
      { strength: 4, text: 'Strong', color: 'text-green-500' },
      { strength: 5, text: 'Very Strong', color: 'text-green-600' },
    ];

    return levels[strength] || levels[0];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Signup Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 pr-10 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Create a password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400" />
                )}
              </button>
            </div>
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Password strength:</span>
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="mt-1 w-full bg-slate-200 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      passwordStrength.strength <= 2 ? 'bg-red-500' :
                      passwordStrength.strength <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <div className="mt-1 relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 pr-10 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={toggleConfirmPasswordVisibility}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400" />
                )}
              </button>
            </div>
            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className="mt-1">
                <span className={`text-xs ${
                  formData.password === formData.confirmPassword
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {formData.password === formData.confirmPassword
                    ? 'Passwords match'
                    : 'Passwords do not match'
                  }
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </div>

          {/* Terms and Conditions */}
          <div className="text-center text-xs text-slate-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
