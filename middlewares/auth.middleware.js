const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config');

/**
 * JWT Authentication Middleware
 * 
 * WHAT this middleware does:
 * 1. Extracts JWT token from Authorization header
 * 2. Verifies the token using the secret key
 * 3. Extracts user information from the token
 * 4. Attaches user data to the request object
 * 5. Allows the request to proceed if token is valid
 * 6. Blocks the request if token is invalid or missing
 * 
 * WHY this is IMPORTANT:
 * - Protects routes from unauthorized access
 * - Ensures only authenticated users can access protected resources
 * - Provides user context to subsequent middleware and controllers
 * - Centralizes authentication logic (DRY principle)
 * 
 * Header format: Authorization: Bearer <token>
 * Example: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

/**
 * Verify JWT Token and Attach User to Request
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = async (req, res, next) => {
  try {
    // Step 1: Get token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No Authorization header provided.',
      });
    }

    // Step 2: Check if header format is correct (Bearer <token>)
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authorization header must start with "Bearer ".',
      });
    }

    // Step 3: Extract token from header
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // Step 4: Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (jwtError) {
      // Handle specific JWT errors
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.',
        });
      }
      
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please login again.',
        });
      }

      // Other JWT errors
      return res.status(401).json({
        success: false,
        message: 'Token verification failed.',
      });
    }

    // Step 5: Check if user still exists in database
    // This handles cases where user was deleted but token is still valid
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token is invalid.',
      });
    }

    // Step 6: Attach user information to request object
    // This makes user data available to subsequent middleware and controllers
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    // Step 7: Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
    });
  }
};

/**
 * Optional: Role-based Authorization Middleware
 * 
 * This middleware can be used to protect routes based on user roles
 * Usage: router.post('/admin', authenticate, authorize('admin'), adminController)
 * 
 * @param {string} role - Required role to access the route
 * @returns {Function} - Express middleware function
 */
const authorize = (role) => {
  return (req, res, next) => {
    // First check if user is authenticated (req.user should exist)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.',
      });
    }

    // Check if user has the required role
    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
    }

    // User has required role, proceed
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
