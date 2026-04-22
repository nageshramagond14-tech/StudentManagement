/**
 * Validation Middleware
 *
 * PURPOSE:
 *   Validate request body BEFORE it reaches the controller/service.
 *   This is the FIRST layer of defense — it catches obvious errors
 *   early so we don't waste a database round-trip.
 *
 * DEFENSE IN DEPTH:
 *   Layer 1: This middleware  → catches missing/invalid fields
 *   Layer 2: Mongoose schema  → catches edge cases (min, max, type)
 *   Layer 3: MongoDB itself   → enforces unique indexes, etc.
 *
 * WHY not rely only on Mongoose validation?
 *   - Mongoose validation happens DURING the database write.
 *   - This middleware prevents invalid data from even reaching
 *     the service layer, saving time and resources.
 *   - The error messages here are more user-friendly.
 */

module.exports = (req, res, next) => {
  console.log('VALIDATION MIDDLEWARE RUNNING. Body:', req.body);
  const { name, age, course, email } = req.body;
  const errors = [];

  // ── Name validation ─────────────────────────────────────────────
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Name is required and must be a non-empty string');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (name.trim().length > 100) {
    errors.push('Name cannot exceed 100 characters');
  }

  // ── Age validation ──────────────────────────────────────────────
  if (age === undefined || age === null || age === '') {
    errors.push('Age is required');
  } else if (typeof age !== 'number' || !Number.isInteger(age)) {
    errors.push('Age must be a whole number (integer)');
  } else if (age < 3 || age > 120) {
    errors.push('Age must be between 3 and 120');
  }

  // ── Course validation ───────────────────────────────────────────
  if (!course || typeof course !== 'string' || !course.trim()) {
    errors.push('Course is required and must be a non-empty string');
  } else if (course.trim().length < 2) {
    errors.push('Course must be at least 2 characters long');
  } else if (course.trim().length > 100) {
    errors.push('Course cannot exceed 100 characters');
  }

  // ── Email validation ────────────────────────────────────────────
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  }

  // ── Return all errors at once (better UX) ───────────────────────
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};