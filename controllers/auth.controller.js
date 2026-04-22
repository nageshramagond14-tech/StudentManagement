const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config');

/**
 * JWT Token Generation
 * 
 * WHY JWT (JSON Web Tokens)?
 *   - Stateless authentication - server doesn't need to store session data
 *   - Contains user information in the token itself
 *   - Can be verified without database calls (after initial login)
 *   - Secure and industry standard for APIs
 * 
 * WHAT's in the token?
 *   - userId: Unique identifier for database queries
 *   - email: User's email for identification
 *   - role: User's role for authorization (future feature)
 *   - iat (issued at): When token was created
 *   - exp (expires): When token expires
 */

/**
 * Generate JWT Token
 * 
 * @param {Object} user - User object
 * @returns {string} - JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn, // Token expires in 7 days
    }
  );
};

/**
 * User Signup
 * 
 * PROCESS:
 * 1. Validate input (name, email, password)
 * 2. Check if user already exists
 * 3. Create new user (password gets hashed automatically)
 * 4. Generate JWT token
 * 5. Return user data and token
 */
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate JWT token
    const token = generateToken(user);

    // Return response (user.toJSON() removes password automatically)
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during signup',
    });
  }
};

/**
 * User Login
 * 
 * PROCESS:
 * 1. Validate input (email, password)
 * 2. Find user by email (include password for comparison)
 * 3. Compare provided password with stored hash
 * 4. Generate JWT token if passwords match
 * 5. Return user data and token
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare provided password with stored hash
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return response (user.toJSON() removes password automatically)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
    });
  }
};

/**
 * Get Current User Profile
 * 
 * This endpoint requires JWT authentication
 * Returns the current user's profile information
 */
const getProfile = async (req, res) => {
  try {
    // User is already attached to request by auth middleware
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching profile',
    });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
};
