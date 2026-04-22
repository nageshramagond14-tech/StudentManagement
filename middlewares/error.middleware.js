/**
 * Global Error Handler Middleware
 *
 * HOW IT WORKS:
 *   Express recognizes this as an error handler because it has
 *   FOUR parameters (err, req, res, next). Regular middleware has 3.
 *
 *   Every time `next(err)` is called anywhere in the app, Express
 *   skips all remaining middleware and jumps directly here.
 *
 * WHAT IT HANDLES:
 *   1. CastError        → Invalid MongoDB ObjectId format
 *   2. ValidationError   → Mongoose schema validation failure
 *   3. Duplicate Key (11000) → Unique index violation
 *   4. Custom errors     → Errors thrown with a `.statusCode` property
 *   5. Unknown errors    → Everything else → 500 Internal Server Error
 */

const config = require('../config');

module.exports = (err, req, res, next) => {
  // Log the full error stack in development for debugging
  console.error('─── ERROR ───────────────────────────────────');
  console.error(`  Type: ${err.name || 'Error'}`);
  console.error(`  Message: ${err.message}`);
  if (config.nodeEnv !== 'production') {
    console.error(`  Stack: ${err.stack}`);
  }
  console.error('─────────────────────────────────────────────');

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // ── 1. Mongoose CastError (Invalid ObjectId) ───────────────────
  // Occurs when: GET /api/students/not-a-valid-id
  // Why: MongoDB ObjectIds must be 24-character hex strings.
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: "${err.value}". Expected a valid MongoDB ObjectId.`;
  }

  // ── 2. Mongoose ValidationError ─────────────────────────────────
  // Occurs when: POST /api/students with { name: "", age: -5 }
  // Why: Schema constraints (required, min, max) are violated.
  if (err.name === 'ValidationError') {
    statusCode = 400;
    // Extract all validation error messages into a single string
    const messages = Object.values(err.errors).map((val) => val.message);
    message = `Validation Error: ${messages.join('. ')}`;
  }

  // ── 3. MongoDB Duplicate Key Error ──────────────────────────────
  // Occurs when: A unique index is violated (e.g., duplicate email)
  // Error code 11000 is MongoDB's way of saying "duplicate key"
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue).join(', ');
    message = `Duplicate value entered for: ${field}. Please use a different value.`;
  }

  // ── Send standardized error response ────────────────────────────
  res.status(statusCode).json({
    success: false,
    message,
    // In development, include the error stack for debugging
    ...(config.nodeEnv !== 'production' && { stack: err.stack }),
  });
};