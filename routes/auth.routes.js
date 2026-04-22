const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { signup, login, getProfile } = require('../controllers/auth.controller');

/**
 * Authentication Routes
 * 
 * These routes handle user authentication operations:
 * - POST /api/auth/signup - Register a new user
 * - POST /api/auth/login - Login existing user
 * - GET /api/auth/profile - Get current user profile (protected)
 * 
 * WHY separate auth routes?
 * - Clean separation of concerns
 * - Easy to maintain and extend
 * - Follows RESTful conventions
 * - Can be easily versioned (/api/v1/auth/)
 */

/**
 * POST /api/auth/signup
 * 
 * Request Body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 * 
 * Response (201 Created):
 * {
 *   "success": true,
 *   "message": "User created successfully",
 *   "data": {
 *     "user": {
 *       "_id": "...",
 *       "name": "John Doe",
 *       "email": "john@example.com",
 *       "role": "user",
 *       "createdAt": "...",
 *       "updatedAt": "..."
 *     },
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 */
router.post('/signup', signup);

/**
 * POST /api/auth/login
 * 
 * Request Body:
 * {
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {
 *     "user": {
 *       "_id": "...",
 *       "name": "John Doe",
 *       "email": "john@example.com",
 *       "role": "user",
 *       "createdAt": "...",
 *       "updatedAt": "..."
 *     },
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 */
router.post('/login', login);

/**
 * GET /api/auth/profile
 * 
 * Headers Required:
 * Authorization: Bearer <token>
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "Profile retrieved successfully",
 *   "data": {
 *     "user": {
 *       "_id": "...",
 *       "name": "John Doe",
 *       "email": "john@example.com",
 *       "role": "user",
 *       "createdAt": "...",
 *       "updatedAt": "..."
 *     }
 *   }
 * }
 * 
 * Error Responses:
 * - 401 Unauthorized: No token, invalid token, or token expired
 * - 404 Not Found: User not found
 * - 500 Internal Server Error: Server error
 */
router.get('/profile', authenticate, getProfile);

module.exports = router;
