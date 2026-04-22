/**
 * Debug Signup Page Component
 * 
 * This is a simplified version to debug the signup issue
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupDebug = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debug, setDebug] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    setDebug('');

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Debug info
    const requestData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };
    setDebug('Sending request: ' + JSON.stringify(requestData, null, 2));

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      setDebug('Response received: ' + JSON.stringify(data, null, 2));

      if (!response.ok) {
        setError(data.message || 'Signup failed');
        setIsLoading(false);
        return;
      }

      if (data.success) {
        setSuccess('Account created successfully! Redirecting...');
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setDebug('Network error: ' + error.message);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Debug Signup
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Back to normal signup
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Enter your name"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Confirm your password"
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          {debug && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2">Debug Info:</h3>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">{debug}</pre>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignupDebug;
